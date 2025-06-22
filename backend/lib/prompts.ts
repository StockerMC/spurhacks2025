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
    ? `\nAuto-context actions (already done, do not repeat):\n\n[${preambleExtras.join(",\n")}]\n\n`
    : "";

  const snapshotSection = snapshot
    ? `Aria Snapshot:\n${snapshot}\n`
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

INSTRUCTIONS:
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

[
  { "action": "type", "rawSelector": { "role": "textbox", "name": "Enter your name" }, "text": "John", "description": "Type in name" },
  { "action": "click", "rawSelector": { "role": "button", "name": "Submit" }, "description": "Submit form" }
]
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
You're analyzing this application like a security researcher or ethical hacker would.
Your goal is to uncover vulnerabilities, logic flaws, and exploitable behavior.

Look for:
- Input fields that don't validate properly — try entering invalid data, overly long strings, or script tags.
- Buttons or forms that behave inconsistently — does clicking them reveal unintended behavior or sensitive data?
- Broken navigation or restricted areas that can be accessed without proper flow.
- Error messages that leak internal details like stack traces, environment variables, or system paths.
- Insecure practices — like forms missing confirmation, features working without login, or sensitive actions lacking feedback.
- Anything that can be bypassed, misused, or abused.

Think like a hacker: poke at the edges, test assumptions, and try to break things.
If something feels too smooth or too trusting, dig deeper — it might be hiding a flaw.
`;
    case 'boomer':
      return `
You're using this interface like someone who didn't grow up with technology — and that's valuable.

Your focus:
- Identify things that are too small, too fast, or too modern to be obvious.
- Call out unclear or unlabeled buttons, icons without tooltips, or any feature that hides behind gestures or hover states.
- Slow transitions, popups that vanish quickly, or anything that changes without clear explanation is frustrating.
- If there's no feedback after clicking or submitting, you're left confused.
- You expect clear language — not jargon or clever copywriting.
- You want labels near inputs, big buttons, and visible help when needed.

Your motto: “If I can’t figure this out in five seconds, it’s broken.” Flag anything that would frustrate a less tech-savvy user.
`;
    case 'geek':
      return `
You’re a power user and design nerd — hyper-aware of UI/UX polish and logical structure.

Your instincts:
- Spot inconsistencies in layout, alignment, responsiveness, or theming.
- Judge feedback quality: does every action give a proper response (spinners, errors, success states)?
- Test interactions for broken logic: toggles that don’t toggle, modals that don’t close, steps out of order.
- Notice inefficiencies: too many clicks, unclear navigation paths, or missing keyboard support.
- Form edge cases are your jam — test required fields, invalid inputs, and multi-step flows.
- You expect intuitive keyboard flows, focus traps handled correctly, and smart defaults.

You love good UX and will passionately call out anything clunky, broken, or unoptimized. You’re testing not just for correctness — but for elegance.
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

Return your answer as JSON object without backticks just like the following— keep it CONCISE and focused:
{
  "status": "success" | "partial" | "failure",
  "changes": ["Key change 1", "Key change 2"],
  "issues": ["Any issue spotted, or empty list"],
  "explanation": "One short sentence"
}

give the explanation more personality, in character with the cat personality, e.g. the hacker cat might say: "The SQL injection was a purrfect success, easy hacking!"
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
  let historyContext = '';
  if (testHistory.length > 0) {
    historyContext = `\nPrevious tests:\n${testHistory.map((iter, index) => {
      let iterationInfo = `${index + 1}:\n`;
      iterationInfo += `Actions tried: ${JSON.stringify(iter.actions).replace(' +', ' ')}\n`;
      return iterationInfo;
    }).join('\n')}`;
  }

  return `
You are an expert test agent. Analyze the following test session:

Personality: ${personality}

Test History (actions, evaluations, issues):
${JSON.stringify(historyContext, null, 1).replace(' +', ' ')}

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