import { Elysia } from "elysia";
import { Agent, llmConfig, model } from "./client";
import { getSessionEvaluationPrompt, Personality } from "../lib/prompts";
import { cors } from '@elysiajs/cors'
import { chromium, ChromiumBrowser } from "playwright";
import { supabase } from "../lib/supabase";

async function runAgent(browser: ChromiumBrowser, url: string, personality: Personality, projectId: number, notes: string) {
    const agent = new Agent(personality, projectId);
    await agent.connect(browser, url);
    let shouldContinue = true;
    let allActions: any[] = [];
    let iteration = 0;
    if (notes) {
      agent.testHistory.push({
        actions: [{ action: 'notes', description: 'User provided notes for the session.' }],
        textContent: notes,
      })
    }
    console.log(`Starting session for personality: ${personality}`);
    while (shouldContinue && iteration < 5) {
      iteration++;
      const actions = await agent.performAction();
      console.log(`Iteration ${iteration} actions:`, actions);
      allActions.push(actions);
      // console.log('Actions received:', actions);
      // if (actions.some((a: any) => a.action === 'end_session')) {
      //   console.log('🛑 AI requested to end the session.');
      //   shouldContinue = false;
      // }
    }
    await agent.disconnect();
    const finalTestHistory = agent.testHistory[agent.testHistory.length - 1];
    const evaluationPrompt = getSessionEvaluationPrompt(
      personality as Personality,
      agent.testHistory,
      finalTestHistory?.textContent || '',
      finalTestHistory?.snapshot || '',
    )
    // // Use the model's countTokens API to get token count
    // const { totalTokens } = await model.countTokens({
    //   model: 'gemini-2.0-flash',
    //   contents: [
    //     { role: 'user', parts: [{ text: evaluationPrompt }] },
    //     { role: 'user', parts: [{ inlineData: { mimeType: 'image/png', data: finalTestHistory.screenshot } }] }
    //   ]
    // });
    // console.log('Evaluation Prompt Token Count:', totalTokens);
    const response = await model.generateContent({
      model: 'gemini-2.0-flash',
      config: llmConfig,
      contents: [
        { role: 'user', parts: [{ text: evaluationPrompt }] },
        { role: 'user', parts: [{ inlineData: { mimeType: 'image/png', data: finalTestHistory.screenshot } }] }
      ]
    });
    // parse the response as json and also handle if it happens to wrapped by ```json..```
    let finalObject = JSON.parse((response.text || '{}').replace(/```json\s*|\s*```/g, '').trim());
    
    // make another row 
    await supabase
      .from('actions')
      .insert({
        project_id: projectId,
        personality,
        action: 'evaluation',
        description: finalTestHistory.textContent,
        screenshot: finalTestHistory.screenshot,
        created_at: new Date().toISOString(),
        finalVerdict: finalObject.verdict || 'No verdict provided',
        finalIssues: finalObject.issues || [],
        finalRecommendations: finalObject.recommendations || [],
        finalSummary: finalObject.summary || '',
      });
    let finalEvaluation = response.text;
    console.log('Session Evaluation:', finalEvaluation);
    return { success: true, actions: allActions };
}

process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY = "1";

const app = new Elysia()
  .use(cors()).listen(8080)
  .get("/", () => "Hello Elysia")
  .post("/test", async ({ body: { url, projectId, notes } }: { body: { url: string, notes: string, projectId: number } }) => {
    if (!url || !projectId) {
      return { error: "Missing required fields: url or projectId" };
    }
    // if (!['hacker', 'boomer', 'geek', 'accessibility cop'].includes(personality)) {
    //   return { error: "Invalid personality" };
    // }

    const personalities = ['hacker', 'boomer', 'geek', 'accessibility cop']
    console.log('Connecting to browser...');
    const browser = await chromium.launch({ headless: true });
    const agentPromises = personalities.map(async (personality) => {
      console.log(`Running agent for personality: ${personality}`);
      return await runAgent(browser, url, personality as Personality, projectId, notes);
    });
    await Promise.all(agentPromises);
    await browser.close();
    return { success: true, message: "Test finished" };
  })
  .listen(8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
