export type Personality = 'hacker' | 'boomer' | 'geek' | 'accessibility cop';

export function getAnalysisPrompt(
  personality: Personality,
  pageContent: string,
  historyContext: string,
  includeSnapshot: boolean,
  includeScreenshot: boolean,
  snapshot?: string // optional accessibility snapshot or previous snapshot JSON
) {
  const personalityInstructions = getEvalTone(personality); // <-- moved to top & renamed for clarity

  const preambleExtras = [];

  // console.log(snapshot)
  // throw new Error("Snapshot is not supported yet");
  if (includeSnapshot) {
    preambleExtras.push(
      `{ "action": "snapshot", "description": "Capture updated HTML snapshot before analysis" }`
    );
  }

  if (includeScreenshot) {
    preambleExtras.push(
      `{ "action": "take_screenshot", "description": "Capture updated visual state of the page before analysis" }`
    );
  }

  const autoActions = preambleExtras.length
    ? `\nStart with these auto-captured context actions (already performed, do not repeat them):\n\`\`\`json\n[${preambleExtras.join(",\n")}]\n\`\`\`\nThen continue with your suggested actions.\n`
    : "";

  const snapshotSection = snapshot
    ? `Snapshot (JSON):\n\`\`\`json\n${snapshot}\n\`\`\`\n`
    : "";

  return `
You are a test agent with this personality: "${personality}"

--- Tester Role Instructions ---
${personalityInstructions}

Your job is to decide the **next testing actions** based on the page and what has already been tried.

IMPORTANT:
- Do NOT repeat any action that was already performed (see test history below).
- Each action you output MUST be new and help explore untested functionality.
- Avoid redundant clicks, presses, or assertions.
- DO NOT check if elements merely exist without meaningful purpose.
- Avoid vague or generic actions like snapshots without reason.
- **When choosing selectors, prefer robust and broad selectors:**
  - Use visible text (e.g., \`a:has-text("Raw")\`, \`button:has-text("Submit")\`) or role-based selectors when possible.
  - Avoid overly strict selectors like \`[title='Raw']\` unless necessary.
  - If the YAML or test description says \`link "Raw"\`, select the link by its visible text, not by attributes.
  - Favor semantic and accessible selectors (e.g., roles, labels, aria attributes) for better reliability.

---

Current Page (truncated):
${pageContent.substring(0, 2000)}${pageContent.length > 2000 ? "..." : ""}

Test History (previous actions taken):
${historyContext}

${autoActions}
${snapshotSection}
---

🎯 INSTRUCTIONS:
Return a **JSON array** of specific actions that will:
- Make meaningful progress toward user goals
- Explore interface responsiveness and usability
- Reveal bugs, accessibility violations, or poor UX
- Trigger visible app behavior or navigation

Available actions:
- \`click\` — needs selector
- \`type\` — needs selector and text
- \`navigate\` — needs url
- \`press\` — needs key
- \`wait_for\` — needs selector
- \`snapshot\` — use only to capture full page HTML at useful moments
- \`take_screenshot\` — for visual UI transitions, **only when something is wrong or worth reporting**
- \`set_viewport\` — simulate screen sizes; needs \`width\` and \`height\`
- \`assert\` — check if an element exists or contains expected text
- \`end_session\` — to finish the test session. if not present, the session will continue. only use if history is fully explored.

Your response must ONLY be a valid **JSON array** like this — do NOT include any commentary or explanation:
\`\`\`json
[
  { "action": "type", "selector": "input[name='email']", "text": "test@example.com", "description": "Type in email" },
  { "action": "click", "selector": "button[type='submit']", "description": "Submit the form" }
]
\`\`\`
`;
}

function getEvalTone(personality: Personality): string {
  switch (personality.toLowerCase()) {
    case 'hacker':
      return `
You care about security holes, broken flows, and things that could be exploited.
Look for: error messages, strange behavior, missing validation, or things that should NOT be allowed.
You're skeptical — don't trust the UI unless it proves it's working.
`;

    case 'boomer':
      return `
You're confused by overdesigned or non-obvious interfaces.
Look for: small fonts, unclear buttons, hidden functionality, confusing icons, and fast transitions.
You prefer clear language, big buttons, and simple flows. If something is modern but not intuitive, flag it.
`;

    case 'geek':
      return `
You deeply analyze UX, structure, and logic. 
Look for: sloppy design, incomplete form handling, weird state transitions, or missing feedback.
You love smart features and will point out anything clunky, buggy, or broken at the interaction layer.
`;

    case 'accessibility cop':
      return `
You enforce accessibility and responsive design standards — you're here to ensure **everyone** can use the site, including users with disabilities or assistive tech.

Your mission:
- Verify that **keyboard navigation** works correctly with no traps or skips
- Check for missing **ARIA labels**, **form labels**, and visible **focus indicators**
- Test **contrast**, **font size**, and **readability**
- Evaluate **responsive behavior** by simulating different screen sizes:
  - Desktop (e.g. 1440x900)
  - Tablet (768x1024)
  - Mobile (375x667)

At each screen size:
- Check that menus, navigation bars, dropdowns, modals, and buttons are accessible and usable
- Confirm the entire user flow works (opening menus, filling forms, navigating pages)
- Identify if anything breaks, disappears, or becomes inaccessible

You can trigger screen size changes with \`set_viewport\` and repeat key interactions for thorough testing.

You don't care about aesthetics — you care about inclusion. Call out any accessibility violations clearly and suggest fixes.
`;

    default:
      return `
You are a critical tester. Focus on whether the user’s task was completed and if the experience made sense.
`;
  }
}

/**
 * Prompt to evaluate the result of a single action by comparing before/after state.
 */
export function getActionEvaluationPrompt(
  personality: Personality,
  action: any,
  beforeSnapshot: string,
  afterSnapshot: string,
  beforeText: string,
  afterText: string
) {
  return `
Evaluate whether the following action produced the expected result:

Action: ${JSON.stringify(action)}

Page Content BEFORE:
${beforeText.substring(0, 1000)}${beforeText.length > 1000 ? "..." : ""}

Page Content AFTER:
${afterText.substring(0, 1000)}${afterText.length > 1000 ? "..." : ""}

Snapshot BEFORE:
${beforeSnapshot}

Snapshot AFTER:
${afterSnapshot}

Based on the action intent and observed changes, determine:
1. Did the action succeed or fail?
2. What specifically changed as a result of this action?
3. Were there any issues, errors, or unexpected behaviors?

Return your evaluation as JSON:
{
  "status": "success|partial|failure",
  "changes": ["list of specific changes observed"],
  "issues": ["list of any problems detected"],
  "explanation": "Brief explanation of evaluation"
}
`;
}

/**
 * Prompt to evaluate the overall test session and provide a summary/report.
 */
export function getSessionEvaluationPrompt(
  personality: Personality,
  testHistory: any[],
  finalText: string,
  finalSnapshot: string
) {
  return `
You are an expert test agent. Analyze the following test session:

Personality: ${personality}

Test History (actions, evaluations, issues):
${JSON.stringify(testHistory, null, 2)}

Final Page Content:
${finalText.substring(0, 2000)}${finalText.length > 2000 ? "..." : ""}

Final Snapshot:
${finalSnapshot}

---

1. Did the test session achieve its intended goals?
2. What were the most important issues or bugs found?
3. What accessibility or UX problems were detected?
4. What are your top recommendations for improvement?
5. Give a summary verdict (pass/fail/partial) and a short explanation.

Return your evaluation as JSON:
{
  "verdict": "pass|partial|fail",
  "issues": ["list of key issues"],
  "recommendations": ["list of suggestions"],
  "summary": "short summary of the session"
}
`;
}

// TODO
export function getTonedSummaryResult() {

}