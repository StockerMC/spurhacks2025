import { Elysia } from "elysia";
import { Agent } from "./client";
import { Personality } from "../lib/prompts";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .post("/test", async ({ body }) => {
    console.log('Received body:', body);
    // Parse body as any to avoid TS errors
    const { url, personality } = body as any;

    const results: any = {};
    if(!['hacker', 'boomer', 'geek', 'accessibility cop'].includes(personality)) {
      return { error: "Invalid personality" };
    }
    // for (const personality of personalities) {
    const agent = new Agent(personality as Personality);
    await agent.connect(url);
    let shouldContinue = true;
    let allActions: any[] = [];
    while (shouldContinue) {
      const actions = await agent.performAction();
      allActions.push(actions);
      if (actions.some((a: any) => a.action === 'end_session')) {
        console.log('🛑 AI requested to end the session.');
        shouldContinue = false;
      }
    }
    await agent.disconnect();
    return { success: true, actions: allActions };
    // return { url,  };
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
