import { Elysia } from "elysia";
import { Agent, llmConfig, model } from "./client";
import { getSessionEvaluationPrompt, Personality } from "../lib/prompts";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .post("/test", async ({ body }) => {
    console.log('Received body:', body);
    // Parse body as any to avoid TS errors
    const { url, personality } = body as any;

    const results: any = {};
    if (!['hacker', 'boomer', 'geek', 'accessibility cop'].includes(personality)) {
      return { error: "Invalid personality" };
    }
    // for (const personality of personalities) {
    const agent = new Agent(personality as Personality);
    await agent.connect(url);
    let shouldContinue = true;
    let allActions: any[] = [];
    let iteration = 0;
    while (shouldContinue && iteration < 5) {
      iteration++;
      const actions = await agent.performAction();
      allActions.push(actions);
      // console.log('Actions received:', actions);
      if (actions.some((a: any) => a.action === 'end_session')) {
        console.log('🛑 AI requested to end the session.');
        shouldContinue = false;
      }
    }
    await agent.disconnect();
    const finalTestHistory = agent.testHistory[agent.testHistory.length - 1];
    const evaluationPrompt = getSessionEvaluationPrompt(
      personality as Personality,
      agent.testHistory,
      finalTestHistory?.textContent || '',
      finalTestHistory?.snapshot || '',
    )
    // Use the model's countTokens API to get token count
    const { totalTokens } = await model.countTokens({
      model: 'gemini-2.0-flash',
      contents: [
        { role: 'user', parts: [{ text: evaluationPrompt }] },
        { role: 'user', parts: [{ inlineData: { mimeType: 'image/png', data: finalTestHistory.screenshot } }] }
      ]
    });
    console.log('Evaluation Prompt Token Count:', totalTokens);
    const response = await model.generateContent({
      model: 'gemini-2.0-flash',
      config: llmConfig,
      contents: [
        { role: 'user', parts: [{ text: evaluationPrompt }] },
        { role: 'user', parts: [{ inlineData: { mimeType: 'image/png', data: finalTestHistory.screenshot } }] }
      ]
    });
    let finalEvaluation = response.text;
    console.log('Session Evaluation:', finalEvaluation);
    return { success: true, actions: allActions };
    // return { url,  };
  })
  .listen(8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
