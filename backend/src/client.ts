import { GoogleGenAI } from '@google/genai';
import { getAnalysisPrompt, Personality, getActionEvaluationPrompt, getSelectorFromAria } from '../lib/prompts';
import { chromium, Browser, Page, BrowserContext } from 'playwright';
import { createAction } from '../lib/databaseUtils';
import * as path from 'path';
import * as fs from 'fs';

// Initialize Gemini
const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_CLOUD_PROJECT, // Replace with your Google Cloud project ID
  location: 'us-central1',
});
ai
export const model = ai.models;
export const llmConfig = {
  temperature: 0.2,
  topP: 0.2,
  topK: 20
};

// Interface for test actions
interface TestAction {
  action: string;
  rawSelector?: { role: string; name?: string }; // raw selector for aria snapshot
  selector?: string; // selector can be an object or a string
  text?: string;
  url?: string;
  description: string;
  key?: string;               // keyboard presses
  expectedText?: string;      // assertions
  timeout?: number;           // waits
  result?: {                  // result of the action
    status: string;
    message?: string;
  };
  width?: number;             // viewport size
  height?: number;            // viewport size
}

// Interface for test iteration results
interface TestIterationResult {
  actions: TestAction[];
  screenshot?: any;
  textContent?: string | null;       // HTML/text content of the page
  timestamp?: number;         // When this iteration occurred
  snapshot?: string;         // aria snapshot
}

class Agent {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  public testHistory: TestIterationResult[] = [];
  private personality: Personality;
  private projectId: string;

  constructor(personality: Personality, projectId: string) {
    this.personality = personality;
    this.projectId = projectId;
  }

  async connect(url: string) {
    console.log('Connecting to browser...');
    this.browser = await chromium.launch({ headless: true });
    console.log('Browser launched successfully');
    // Enable video recording to src/screenshots
    this.context = await this.browser.newContext({
      recordVideo: { dir: 'src/screenshots', size: { width: 1280, height: 720 } }
    });
    this.page = await this.context.newPage();
    await this.page.goto(url);
    this.testHistory = [];
    return true;
  }

  async performAction() {
    if (!this.page) throw new Error('Page not initialized');
    // Start video recording is handled by context
    // Take screenshot at the beginning
    // TODO FIGURE OUT IF FULL PAGE IS BETTER
    const screenshotBuffer = await this.page.screenshot({ fullPage: false });
    // Save screenshot to screenshots folder
    // const screenshotsDir = path.resolve('src/screenshots');
    // if (!fs.existsSync(screenshotsDir)) {
    //   fs.mkdirSync(screenshotsDir, { recursive: true });
    // }
    // const screenshotPath = path.join(screenshotsDir, `screenshot-${Date.now()}.png`);
    // fs.writeFileSync(screenshotPath, screenshotBuffer);
    // console.log(`📸 Screenshot saved to ${screenshotPath}`);
    // // throw new Error('Screenshot saved to screenshots folder, but this is not supported yet.'); // TODO: remove this line when screenshot saving is implemented
    const ariaSnapshot = await this.page.locator('body').ariaSnapshot();
    // Save screenshot if needed
    this.testHistory.push({ actions: [], screenshot: screenshotBuffer.toString('base64'), timestamp: Date.now(), snapshot: JSON.stringify(ariaSnapshot) });
    

    // Get page content
    // const textContent = await this.page.content();
    let historyContext = '';
    if (this.testHistory.length > 0) {
      historyContext = `\nPrevious tests:\n${this.testHistory.map((iter, index) => {
        let iterationInfo = `${index + 1}:\n`;
        iterationInfo += `Actions tried: ${JSON.stringify(iter.actions).replace(' +', ' ')}\n`;
        return iterationInfo;
      }).join('\n')}`;
    }

    const textContent = await getVisibleText(this.page);

    const analysisPrompt = getAnalysisPrompt(
      this.personality,
      textContent.replace(' +', ' '),
      historyContext.replace(' +', ' '),
      true,
      true,
      JSON.stringify(ariaSnapshot).replace(' +', ' ')
    );

    // Use the countTokens API to estimate token usage for the prompt and screenshot
    // const promptTokenCount = await model.countTokens({
    //   model: 'gemini-2.0-flash',
    //   contents: [
    //     { role: 'user', parts: [{ text: analysisPrompt }] },
    //     { role: 'user', parts: [{ inlineData: { mimeType: 'image/png', data: screenshotBuffer.toString('base64') } }] }
    //   ]
    // });
    // console.log(`🔢 Estimated tokens for prompt + screenshot:`, promptTokenCount.totalTokens);
    // // // Write the analysis prompt to a file for debugging
    // // fs.writeFileSync('src/screenshots/analysisPrompt.txt', analysisPrompt);
    // console.log(analysisPrompt.length);
    // console.log(screenshotBuffer.toString("base64").length);

    // gemini call
    const response = await model.generateContent({
      model: 'gemini-2.0-flash',
      config: llmConfig,
      contents: [
        { role: 'user', parts: [{ text: analysisPrompt }] },
        { role: 'user', parts: [{ inlineData: { mimeType: 'image/png', data: screenshotBuffer.toString('base64') } }] }
      ]
    });
    let actionPlan = response.text || '';

    // Clean up the response - extract JSON from the response
    // First attempt to find JSON array in the text
    const jsonMatch = actionPlan.match(/\[\s*\{.*\}\s*\]/s);
    if (jsonMatch) {
      actionPlan = jsonMatch[0];
    } else {
      // If no JSON array found, try standard cleanup
      actionPlan = actionPlan.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    }

    // Parse and log the action plan
    let actions: TestAction[] = [];
    try {
      actions = JSON.parse(actionPlan);
      actions.forEach((action: TestAction, index: number) => {
        console.log(`   ${index + 1}. ${action.action}: ${action.description}`);
        if (action.selector) {
          action.selector = getSelectorFromAria(action?.rawSelector?.role, action?.rawSelector?.name);
        }
      });
    } catch (parseError) {
      console.error('❌ Failed to parse action plan as JSON:', parseError);
      console.log('Raw response:', actionPlan);
      // throw new Error('Failed to parse AI response as JSON');
    }

    // Execute each action in the plan SEQUENTIALLY (await each action)
    const actionResults: TestAction[] = [];
    for (const action of actions) {
      console.log(`🎬 Executing: ${action.description}`);
      let result: any = { status: 'success' };
      try {
        if (!this.page) throw new Error('Page not initialized');
        // Capture state BEFORE action
        const beforeText = await getVisibleText(this.page);
        const beforeSnapshot = await this.page.locator('body').ariaSnapshot();
        // Normalize action name by removing browser_ prefix if present
        const actionType = action.action.replace('browser_', '');
        switch (actionType) {
          case 'click':
            if (action.selector) {
              await this.page.click(action.selector, { timeout: action.timeout || 5000 });
            }
            break;
          case 'type':
            if (action.selector && action.text !== undefined) await this.page.fill(action.selector, action.text, { timeout: action.timeout || 5000 });
            break;
          case 'wait':
          case 'wait_for':
            if (action.selector) await this.page.waitForSelector(action.selector, { timeout: action.timeout || 5000 });
            break;
          case 'screenshot':
          case 'take_screenshot':
            const screenshot = await this.page.screenshot({ fullPage: true });
            this.testHistory.push({
              actions: [action],
              screenshot: screenshot.toString('base64'),
              timestamp: Date.now()
            });
            console.log('📸 Screenshot captured and stored in history');
            break;
          case 'navigate':
            if (action.url) await this.page.goto(action.url);
            break;
          case 'snapshot':
            const snapshotContent = await this.page.locator('body').ariaSnapshot();
            // Get text content of all visible elements (not just body)
            const visibleTextContent = await getVisibleText(this.page);
            this.testHistory.push({
              actions: [action],
              textContent: visibleTextContent,
              snapshot: JSON.stringify(snapshotContent),
              timestamp: Date.now()
            });
            console.log('📄 Page content captured and stored in history');
            break;
          case 'press':
            await this.page.keyboard.press(action.key || 'Enter');
            console.log(`🎹 Pressed key: ${action.key || 'Enter'}`);
            break;
          case 'assert':
            try {
              if (action.selector) {
                await this.page.waitForSelector(action.selector, { timeout: 5000 });
                console.log(`✅ Assertion passed: Element exists: ${action.selector}`);
                if (action.expectedText) {
                  const content = await this.page.textContent(action.selector);
                  if (content && content.includes(action.expectedText)) {
                    console.log(`✅ Assertion passed: Text "${action.expectedText}" found`);
                    result = { status: 'success', message: `Text '${action.expectedText}' found` };
                  } else {
                    console.log(`❌ Assertion failed: Text "${action.expectedText}" not found`);
                    result = { status: 'assertion_failed', message: `Text '${action.expectedText}' not found` };
                  }
                } else {
                  result = { status: 'success', message: `Element '${action.selector}' exists` };
                }
              }
            } catch (assertError) {
              console.error(`❌ Assertion failed: ${action.description}`, assertError);
              const err = assertError as any;
              result = { status: 'assertion_error', message: err?.message || String(assertError) };
            }
            break;
          case 'scroll':
            if (action.selector) {
              const element = await this.page.$(action.selector);
              if (element) {
                await element.scrollIntoViewIfNeeded();
                console.log(`📜 Scrolled to element: ${action.selector}`);
                result = { status: 'success', message: `Scrolled to element: ${action.selector}` };
              } else {
                console.warn(`⚠️ Element not found for scrolling: ${action.selector}`);
                result = { status: 'not_found', message: `Element not found: ${action.selector}` };
              }
            } else {
              await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
              console.log('📜 Scrolled to bottom of the page');
              result = { status: 'success', message: 'Scrolled to bottom of the page' };
            }
            break;
          case 'set_viewport':
            // how to avoid issues for this reason: page.setViewportSize(viewportSize) will resize the page. A lot of websites don't expect phones to change size, so you should set the viewport size before navigating to the page. page.setViewportSize(viewportSize) will also reset screen size, use browser.newContext([options]) with screen and viewport parameters if you need better control of these properties.
            if (action.width && action.height) {
              await this.page.setViewportSize({ width: action.width, height: action.height });
              console.log(`📏 Viewport set to ${action.width}x${action.height}`);
              result = { status: 'success', message: `Viewport set to ${action.width}x${action.height}` };
              break;
            }
          default:
            // No-op for unknown actions
            result = { status: 'unknown_action', message: `Unknown action: ${actionType}` };
            break;
        }
        // Capture state AFTER action
        const afterText = await getVisibleText(this.page);
        const afterSnapshot = await this.page.locator('body').ariaSnapshot();
        // Evaluate the action
        // Start evaluation prompt asynchronously
        const evalPromise = (async () => {
          const evalPrompt = getActionEvaluationPrompt(
            this.personality,
            action,
            JSON.stringify(beforeSnapshot),
            JSON.stringify(afterSnapshot),
            beforeText,
            afterText
          );
          // Use the countTokens API to estimate token usage for the prompt and screenshot
          // const promptTokenCount = await model.countTokens({
          //   model: 'gemini-2.0-flash',
          //   contents: [
          //     { role: 'user', parts: [{ text: evalPrompt }] },
          //   ]
          // });
          // console.log(`🔢 Estimated tokens for eval prompt:`, promptTokenCount.totalTokens);

          const evalResponse = await model.generateContent({
            model: 'gemini-2.0-flash',
            config: llmConfig,
            contents: [{ role: 'user', parts: [{ text: evalPrompt }] }]
          });
          let evaluation;
          try {
            evaluation = evalResponse.text ? JSON.parse(evalResponse.text) : { status: 'unknown', explanation: 'No evaluation provided', issues: [] };
            
          } catch (e) {
            // Try to extract JSON if wrapped in ```json ... ```
            const jsonBlockMatch = evalResponse.text?.match(/```json\s*([\s\S]*?)```/);
            if (jsonBlockMatch && jsonBlockMatch[1]) {
              try {
                evaluation = JSON.parse(jsonBlockMatch[1]);
              } catch {
                evaluation = { status: 'unknown', explanation: 'Could not parse evaluation', issues: [evalResponse.text] };
              }
            } else {
              evaluation = { status: 'unknown', explanation: 'Could not parse evaluation', issues: [evalResponse.text] };
            }
          }          console.log(`🔍 Action evaluation:`, evaluation);
          
          // Log the action to the database
          try {
            const actionData = {
              agent: this.personality,
              changes: evaluation?.changes || [],
              issues: [this.page?.url() || ''],
              status: evaluation?.status || 'unknown',
              finalVerdict: evaluation?.verdict || 'unknown',
              finalSummary: evaluation?.explanation || 'No explanation provided',
              finalIssues: evaluation?.issues || [],
              finalRecommendations: evaluation?.recommendations || [],
              project_id: null // Set this if you have a project ID context
            };
            
            const savedAction = await createAction(actionData);
            console.log(`💾 Action logged to database with ID: ${savedAction?.id || 'unknown'}`);
          } catch (dbError) {
            console.error('Failed to log action to database:', dbError);
          }
        })();
      } catch (actionError) {
        console.error(`❌ Action failed: ${action.description}`, actionError);
        const err = actionError as any;
        if (err?.name === 'TimeoutError') {
          result = { status: 'timeout', message: err?.message };
        } else {
          result = { status: 'error', message: err?.message || String(actionError) };
        }
      }
      // Attach result to action and store
      actionResults.push({ ...action, result });
    }
    // Take final screenshot and get content for this iteration
    const finalScreenshot = await this.page.screenshot({ fullPage: true });
    const finalSnapshot = await this.page.locator('body').ariaSnapshot();
    const finaltextContent = await getVisibleText(this.page);

    this.testHistory.push({
      actions: actionResults,
      textContent: finaltextContent,
      snapshot: JSON.stringify(finalSnapshot),
      screenshot: finalScreenshot.toString('base64'),
      timestamp: Date.now()
    });
    console.log('📝 Test iteration completed and saved to history');
    // Save video to screenshots directory (after all iterations and post-processing)
    if (this.page && this.page.video) {
      const video = this.page.video();
      if (video) {
        const videoPath = await video.path();
        const fs = require('fs');
        const path = require('path');
        const destDir = path.resolve('src/screenshots');
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        // TODO
        // const destPath = path.join(destDir, `test-video-${Date.now()}.webm`);
        // fs.copyFileSync(videoPath, destPath);
        // console.log(`🎥 Video saved to ${destPath}`);
      }
    }
    // Return actions for session control
    return actionResults;
  }

  async disconnect() {
    if (this.browser) await this.browser.close();
  }
}

// Helper to get visible text content from the page
async function getVisibleText(page: Page): Promise<string> {
  return await page.evaluate(() => {
    function isVisible(elem: Element): boolean {
      const style = window.getComputedStyle(elem);
      return (
        style &&
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.opacity !== '0' &&
        elem.getClientRects().length > 0
      );
    }
    const all = Array.from(document.querySelectorAll('body *'));
    const leafVisible = all.filter(el => {
      if (!isVisible(el)) return false;
      return !Array.from(el.children).some(child => isVisible(child));
    });
    return leafVisible.map(el => el.textContent?.trim() || '').filter(Boolean).join(' ');
  });
}

export { Agent };
