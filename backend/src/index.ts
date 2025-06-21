import { Elysia } from "elysia";
import { Agent } from "./client";
import { Personality } from "../lib/prompts";

// async function sigma() {
//   const agent = new Agent(personality);
//   await agent.connect();
//   await agent.initSession(url);
//   await agent.performAction();
//   await agent.disconnect();
// }

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .post("/test", async ({ body }) => {
    // Parse body as any to avoid TS errors
    const { url, personality } = body as any;
    console.log(personality);
    const results: any = {};
    if(!['hacker', 'boomer', 'geek', 'accessibility cop'].includes(personality)) {
      return { error: "Invalid personality" };
    }
    // for (const personality of personalities) {
    const agent = new Agent('accessibility cop');
    await agent.connect(url);
    await agent.performAction();
    await agent.disconnect();
    results['accessibility cop'] = { success: true };
    // }
    return { url, results };
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
