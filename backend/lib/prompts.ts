export type Personality = 'hacker' | 'boomer' | 'geek' | 'accessibility cop';

export function getAnalysisPrompt(
  personality: Personality,
  pageContent: string,
  historyContext: string,
  includeSnapshot: boolean,
  includeScreenshot: boolean,
  snapshot?: string
) {
  const personalityInstructions = getEvalTone(personality);

  const preambleExtras = [];

  if (includeSnapshot) {
    preambleExtras.push(
      `{ "action": "snapshot", "description": "Capture HTML snapshot" }`
    );
  }

  if (includeScreenshot) {
    preambleExtras.push(
      `{ "action": "take_screenshot", "description": "Capture current visual state" }`
    );
  }

  const autoActions = preambleExtras.length
    ? `\nAuto-context actions (already done, do not repeat):\n\`\`\`json\n[${preambleExtras.join(",\n")}]\n\`\`\`\n`
    : "";

  const snapshotSection = snapshot
    ? `Snapshot (JSON):\n\`\`\`json\n${snapshot}\n\`\`\`\n`
    : "";

  return `  
You are a test agent with personality: "${personality}"

--- Tester Instructions ---
${personalityInstructions}

Your job is to suggest new testing actions for the page below. Actions must be useful, non-redundant, and help explore functionality or reveal bugs.

IMPORTANT:
- Do NOT repeat previous actions (see history below).
- Do NOT suggest vague actions (like aimless snapshots).
- DO NOT suggest "check if exists" without purpose.
- Prioritize progress, feedback, and coverage.

SELECTOR GUIDANCE:
- Instead of CSS selectors, return selectors as JSON objects with:
  - "role": the ARIA or semantic role of the element (e.g. "button", "textbox", "link", "listitem")
  - "name": the accessible name or label text for that element, if available
- This role and name will be used in code to generate selectors, so be as accurate as possible.
- Prefer visible text or labels as the accessible name.
- If no accessible name is applicable or available, you can omit the "name" property or use an empty string.

ARIA SNAPSHOT USAGE:
When aria snapshot includes items like:
- \`textbox: Enter your name\`
Return selectors like:
  \`{ "role": "textbox", "name": "Enter your name" }\`
For buttons/links, use visible text as name, e.g.:
  \`{ "role": "button", "name": "Submit" }\`

Be precise but not overly strict; allow flexible matching in selectors.

---

Page Content:
${pageContent.replace(' +', ' ').substring(0, 500)}${pageContent.replace(' +', ' ').length > 500 ? "..." : ""}

Test History:
${historyContext}

${autoActions}
${snapshotSection}

---

🎯 INSTRUCTIONS:
Return a JSON array of specific, useful actions to:
- Advance interaction meaningfully
- Reveal bugs, violations, or state changes
- Test responsiveness, accessibility, or UX flaws

Available actions:
- \`click\`, \`type\`, \`navigate\`, \`press\`, \`wait_for\`
- \`snapshot\`, \`take_screenshot\`, \`set_viewport\`, \`assert\`, \`end_session\`

Each action object must include:
- "action": the action type
- "rawSelector": an object with "role" and optional "name"
- "text": (if action is "type")
- "description": short explanation

Response must be ONLY a JSON array — no commentary:

\`\`\`json
[
  { "action": "type", "rawSelector": { "role": "textbox", "name": "Enter your name" }, "text": "John", "description": "Type in name" },
  { "action": "click", "rawSelector": { "role": "button", "name": "Submit" }, "description": "Submit form" }
]
\`\`\`
`;
}

export function getSelectorFromAria(role?: string, name?: string): string {
  const hasText = name ? `:has-text("${name}")` : '';
  const attr = name ? `[aria-label="${name}"], [title="${name}"]` : '';

  switch (role) {
    case 'heading':
      return [
        `h1${hasText}`,
        `h2${hasText}`,
        `h3${hasText}`,
        `h4${hasText}`,
        `h5${hasText}`,
        `h6${hasText}`,
        `[role="heading"]${hasText}`
      ].join(', ');

    case 'textbox':
      return [
        `input[type="text"][value="${name}"]`,
        `input[placeholder="${name}"]`,
        `input${attr}`,
        `textarea[placeholder="${name}"]`,
        `textarea${attr}`,
        `label:has-text("${name}") + input`,
        `label:has-text("${name}") + textarea`
      ].join(', ');

    case 'text':
      return name ? `text="${name}"` : '*:not(script):not(style)';

    case 'paragraph':
      return `p${hasText}`;

    case 'button':
      return `button${hasText}, [role="button"]${hasText}`;

    case 'link':
      return `a${hasText}, [role="link"]${hasText}`;

    case 'checkbox':
      return [
        `input[type="checkbox"]${attr}`,
        `label:has-text("${name}") input[type="checkbox"]`
      ].join(', ');

    case 'radio':
      return [
        `input[type="radio"]${attr}`,
        `label:has-text("${name}") input[type="radio"]`
      ].join(', ');

    case 'list':
      return `ul${hasText}, ol${hasText}, [role="list"]${hasText}`;

    case 'listitem':
      return `li${hasText}, [role="listitem"]${hasText}`;

    case 'group':
      return `[role="group"]${hasText}, fieldset${hasText}, details${hasText}`;

    case 'combobox':
      return `[role="combobox"]${hasText}, input[list]${hasText}`;

    case 'option':
      return `option${hasText}, [role="option"]${hasText}`;

    case 'menuitem':
      return `[role="menuitem"]${hasText}`;

    case 'tab':
      return `[role="tab"]${hasText}`;

    case 'tabpanel':
      return `[role="tabpanel"]${hasText}`;

    default:
      return name ? `*[aria-label="${name}"], *:has-text("${name}")` : `[role="${role}"]`;
  }
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
Evaluate if this action with the personality '${personality}' had the intended effect.

Action:
${JSON.stringify(action)}

Before (text):
${beforeText.substring(0, 500)}${beforeText.length > 500 ? "..." : ""}

After (text):
${afterText.substring(0, 500)}${afterText.length > 500 ? "..." : ""}

Before (snapshot):
${beforeSnapshot.substring(0, 1000)}${beforeSnapshot.length > 1000 ? "..." : ""}

After (snapshot):
${afterSnapshot.substring(0, 1000)}${afterSnapshot.length > 1000 ? "..." : ""}

Return your answer as JSON — keep it CONCISE and focused:
\`\`\`json
{
  "status": "success" | "partial" | "failure",
  "changes": ["Key change 1", "Key change 2"],
  "issues": ["Any issue spotted, or empty list"],
  "explanation": "One short sentence"
}
\`\`\`
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
${JSON.stringify(testHistory, null, 1).replace(' +', ' ')}

Final Page Content:
${finalText.replace(' +', ' ').substring(0, 1000)}${finalText.replace(' +', ' ').length > 1000 ? "..." : ""}

Final Snapshot:
${finalSnapshot.replace(' +', ' ')}

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