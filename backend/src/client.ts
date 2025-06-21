import { GoogleGenerativeAI } from '@google/generative-ai';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Interface for test actions
interface TestAction {
  action: string;
  selector?: string;
  text?: string;
  url?: string;
  description: string;
  key?: string;               // keyboard presses
  expectedText?: string;      // assertions
  timeout?: number;           // waits
}

// Interface for test iteration results
interface TestIterationResult {
  iteration: number;
  actions: TestAction[];
  success: boolean;
  feedback: string;
  screenshot?: any;
}

class MCPPlaywrightClient {
  private client: Client;
  private transport: StdioClientTransport;
  private testHistory: TestIterationResult[] = [];

  constructor() {
    // Use stdio transport to connect to MCP server process
    this.transport = new StdioClientTransport({
      command: 'npx',
      args: ['@playwright/mcp', '--headless']
    });
    
    this.client = new Client({
      name: 'gemini-playwright-client',
      version: '1.0.0'
    }, {
      capabilities: {
        tools: {}
      }
    });
  }
  async connect() {
    try {
      await this.client.connect(this.transport);
      console.log('🔗 Connected to MCP Playwright server');
      
      const tools = await this.client.listTools();
      console.log('📋 Available tools:', tools.tools.map(t => t.name).join(', '));
      
      // Reset test history when connecting
      this.testHistory = [];
      
      return true;
    } catch (error) {
      console.error('❌ Failed to connect to MCP server:', error);
      return false;
    }
  }

  async callTool(name: string, args: any) {
    try {
      const result = await this.client.callTool({ name, arguments: args });
      return result;
    } catch (error) {
      console.error(`❌ Tool call failed for ${name}:`, error);
      throw error;
    }
  }
  async testWebsite(url: string, testObjective: string, maxIterations: number = 3) {
    try {
      const newPageResult = await this.callTool('browser_tab_new', {});
      console.log('📄 New page created');
      
      // Navigate to the URL
      await this.callTool('browser_navigate', { url });
      console.log(`🌐 Navigated to: ${url}`);
      
      let currentIteration = 0;
      let testCompleted = false;
      let finalResult = null;
      
      // Keep testing until we reach max iterations or succeed
      while (currentIteration < maxIterations && !testCompleted) {
        currentIteration++;
        console.log(`\n🔄 Starting iteration ${currentIteration} of ${maxIterations}`);
        
        try {
          // Take screenshot at the beginning of this iteration
          const screenshotResult = await this.callTool('browser_take_screenshot', {});
          console.log('📸 Screenshot taken for current state');
          
          // Get page content
          const contentResult = await this.callTool('browser_snapshot', {});
          const pageContent = (contentResult as any).content?.[0]?.text || '';
          
          // Build the prompt with history of previous iterations if available
          let historyContext = '';
          if (this.testHistory.length > 0) {
            historyContext = `\nPrevious test iterations:\n${this.testHistory.map(iter => 
              `Iteration ${iter.iteration}: ${iter.success ? 'Partially successful' : 'Failed'}\n` +
              `Actions tried: ${JSON.stringify(iter.actions)}\n` +
              `Feedback: ${iter.feedback}\n`
            ).join('\n')}`;
          }
            // Use Gemini to analyze the page and determine testing actions
          const analysisPrompt = `
You are a web testing expert. You need to test a website to achieve this objective: "${testObjective}"

Here's the current page content:
${pageContent.substring(0, 2000)}...
${historyContext}

This is iteration ${currentIteration} of ${maxIterations}.
${currentIteration > 1 ? 'Based on previous attempts, try a different approach to achieve the objective.' : ''}

Based on the current page state, provide a JSON response with the next testing actions to take. 
You can use any of the following actions (with or without the browser_ prefix):
- click: Click on elements (needs selector)
- type: Type text into inputs (needs selector and text)
- navigate: Navigate to URLs (needs url)
- wait_for: Wait for elements (needs selector)
- take_screenshot: Take screenshots
- snapshot: Get page content
- press: Press a keyboard key (needs key name like "Enter", "Tab", "ArrowDown", etc.)
- assert: Check if an element exists or condition is met (needs selector and optional expectedText)

Respond with a JSON array of actions like:
[
  {"action": "click", "selector": "button[type='submit']", "description": "Click submit button"},
  {"action": "type", "selector": "input[name='email']", "text": "test@example.com", "description": "Type in email field"},
  {"action": "press", "key": "Enter", "description": "Press Enter to submit form"},
  {"action": "assert", "selector": ".results", "expectedText": "Success", "description": "Verify results appeared"},
  {"action": "take_screenshot", "description": "Take screenshot after action"}
]

Only return the JSON array, no other text.
`;
          const response = await model.generateContent(analysisPrompt);
          let actionPlan = response.response.text();
          
          console.log('🤖 Gemini analysis for iteration', currentIteration);
            // Clean up the response - remove markdown code blocks if present
          actionPlan = actionPlan.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
            // Parse and log the action plan
          let actions: TestAction[];
          try {
            actions = JSON.parse(actionPlan);
            console.log(`🤖 Gemini planned ${actions.length} actions for iteration ${currentIteration}:`);
            actions.forEach((action: TestAction, index: number) => {
              console.log(`   ${index + 1}. ${action.action}: ${action.description}`);
            });
          } catch (parseError) {
            console.error('❌ Failed to parse action plan as JSON:', parseError);
            console.log('Raw response:', actionPlan);
            throw new Error('Failed to parse AI response as JSON');
          }
          
          // Execute each action in the plan
          for (const action of actions) {
            console.log(`🎬 Executing: ${action.description}`);
            try {
              // Normalize action name by removing browser_ prefix if present
              const actionType = action.action.replace('browser_', '');
                switch (actionType) {
                case 'click':
                  await this.callTool('browser_click', { selector: action.selector });
                  break;
                case 'type':
                  await this.callTool('browser_type', { 
                    selector: action.selector, 
                    text: action.text 
                  });
                  break;
                case 'wait':
                case 'wait_for':
                  await this.callTool('browser_wait_for', { 
                    selector: action.selector 
                  });
                  break;
                case 'screenshot':
                case 'take_screenshot':
                  await this.callTool('browser_take_screenshot', {});
                  break;
                case 'navigate':
                  await this.callTool('browser_navigate', { url: action.url });
                  break;
                case 'snapshot':
                  await this.callTool('browser_snapshot', {});
                  break;
                case 'press':
                  await this.callTool('browser_press_key', { 
                    key: action.key || 'Enter'  // Default to Enter if not specified
                  });
                  console.log(`🎹 Pressed key: ${action.key || 'Enter'}`);
                  break;
                case 'assert':
                  try {
                    // First wait for the element to ensure it's present
                    await this.callTool('browser_wait_for', { 
                      selector: action.selector,
                      timeout: 5000  // 5 seconds timeout
                    });
                    console.log(`✅ Assertion passed: Element exists: ${action.selector}`);
                    
                    // If expectedText is provided, verify the text content
                    if (action.expectedText) {
                      // We can't directly verify text content with MCP tools
                      // So we'll take a snapshot and check if the text is present
                      const snapshot = await this.callTool('browser_snapshot', {});
                      const content = (snapshot as any).content?.[0]?.text || '';
                      
                      if (content.includes(action.expectedText)) {
                        console.log(`✅ Assertion passed: Text "${action.expectedText}" found`);
                      } else {
                        console.log(`❌ Assertion failed: Text "${action.expectedText}" not found`);
                      }
                    }
                  } catch (assertError) {
                    console.error(`❌ Assertion failed: ${action.description}`, assertError);
                  }
                  break;
                default:
                  console.warn(`⚠️ Unknown action type: ${action.action}`);
                  // Try to call the tool directly if it starts with browser_
                  if (action.action.startsWith('browser_')) {
                    try {
                      console.log(`🔄 Attempting to call tool directly: ${action.action}`);
                      await this.callTool(action.action, { 
                        selector: action.selector,
                        text: action.text,
                        url: action.url
                      });
                    } catch (directCallError) {
                      console.error(`❌ Direct tool call failed for ${action.action}:`, directCallError);
                    }
                  }
              }
              
              // Small delay between actions
              await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (actionError) {
              console.error(`❌ Action failed: ${action.description}`, actionError);
              // Continue with the next action rather than failing the entire test
            }
          }
          
          // Take final screenshot and get content for this iteration
          const finalScreenshot = await this.callTool('browser_take_screenshot', {});
          const finalContent = await this.callTool('browser_snapshot', {});
          const finalPageContent = (finalContent as any).content?.[0]?.text || '';

            // TODO: change this god awful prompt
          const evaluationPrompt = `
Test objective was: "${testObjective}"

Current iteration: ${currentIteration} of ${maxIterations}

Final page content after actions:
${finalPageContent.substring(0, 2000)}...

${historyContext}

Based on the current page state, evaluate if the test objective was achieved. Provide:
1. A brief summary of what happened during this iteration
2. Whether the test was successful in achieving the objective (respond with "Success: Yes" or "Success: No")
3. If not fully successful, what specific issues remain to be solved
4. Suggestions for the next iteration (if needed)
5. Rate the success as a percentage (0-100%)

For a web test, success means the specified user journey was completed and the expected content or functionality was verified.
If you're testing search functionality, success means the search query was entered, the search was submitted, and results were displayed.
If you're testing a form, success means the form was filled and submitted with verification of success.

Your evaluation should be constructive and help guide the next iteration.
`;

          const evaluation = await model.generateContent(evaluationPrompt);
          const iterationResult = evaluation.response.text();
          
          console.log(`📊 Iteration ${currentIteration} Results:`);
          console.log(iterationResult);
            // Store this iteration in history
          this.testHistory.push({
            iteration: currentIteration,
            actions: actions,
            success: iterationResult.includes('100%') || 
                    iterationResult.toLowerCase().includes('objective achieved') || 
                    iterationResult.toLowerCase().includes('test was successful') ||
                    iterationResult.toLowerCase().includes('success: yes'),
            feedback: iterationResult,
            screenshot: finalScreenshot
          });
          
          // Check if we've successfully completed the test
          if (
            iterationResult.includes('100%') || 
            iterationResult.toLowerCase().includes('objective achieved') || 
            iterationResult.toLowerCase().includes('test was successful') ||
            iterationResult.toLowerCase().includes('success: yes')
          ) {
            console.log('🎉 Test objective achieved!');
            testCompleted = true;
            finalResult = {
              success: true,
              objective: testObjective,
              iterations: currentIteration,
              history: this.testHistory,
              actions: actions,
              result: iterationResult
            };
          } else if (currentIteration >= maxIterations) {
            // Final iteration but not fully successful
            console.log('⚠️ Maximum iterations reached without full success');
              // Do a final evaluation across all iterations
            const finalEvaluationPrompt = `
Test objective was: "${testObjective}"

Test conducted over ${maxIterations} iterations.
${this.testHistory.map(iter => 
  `\nIteration ${iter.iteration} summary:\n${iter.feedback.substring(0, 200)}...`
).join('\n')}

Provide a comprehensive final assessment:
1. What worked and what didn't work across all iterations
2. The closest we got to achieving the objective (which iteration)
3. Overall success rating (0-100%)
4. Specific suggestions for future testing
5. Exact steps that would be needed to achieve the test objective

Your evaluation should be detailed and provide concrete, actionable feedback.
`;
            
            const finalEvaluation = await model.generateContent(finalEvaluationPrompt);
            const finalAssessment = finalEvaluation.response.text();
            
            console.log('📑 Final Assessment:');
            console.log(finalAssessment);
            
            finalResult = {
              success: false,
              objective: testObjective,
              iterations: currentIteration,
              history: this.testHistory,
              result: finalAssessment
            };
          }
          
          // If not the last iteration and not completed, navigate back to the original URL to reset
          if (!testCompleted && currentIteration < maxIterations) {
            console.log('🔄 Resetting page for next iteration...');
            await this.callTool('browser_navigate', { url });
            await new Promise(resolve => setTimeout(resolve, 2000)); // Allow page to load
          }
          
        } catch (iterationError) {
          console.error(`❌ Iteration ${currentIteration} failed:`, iterationError);
          
          // Add the failed iteration to history
          this.testHistory.push({
            iteration: currentIteration,
            actions: [],
            success: false,
            feedback: `Technical error: ${iterationError instanceof Error ? iterationError.message : String(iterationError)}`
          });
          
          // Try to reset for next iteration if not the last one
          if (currentIteration < maxIterations) {
            try {
              console.log('🔄 Attempting to reset page after error...');
              await this.callTool('browser_navigate', { url });
              await new Promise(resolve => setTimeout(resolve, 2000)); // Allow page to load
            } catch (resetError) {
              console.error('❌ Failed to reset page:', resetError);
            }
          }
        }
      }
      
      return finalResult || {
        success: false,
        objective: testObjective,
        iterations: currentIteration,
        history: this.testHistory,
        error: 'Test could not be completed due to technical issues'
      };
      
    } catch (error) {
      console.error('❌ Test execution failed:', error);
      return { 
        success: false, 
        objective: testObjective,
        iterations: 0,
        history: this.testHistory,
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  async disconnect() {
    try {
      await this.client.close();
      console.log('🔌 Disconnected from MCP server');
    } catch (error) {
      console.error('❌ Error disconnecting:', error);
    }
  }
}

export { MCPPlaywrightClient };
