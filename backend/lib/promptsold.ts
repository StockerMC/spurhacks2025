export function getEvalPrompt(personality: string, finalPageContent: string, historyContext: string) {
  return `
You are simulating the personality: "${personality}"

Your job is to evaluate whether the test was successful, based on the test history and current page content.

---

🧾 Page Content (truncated):
${finalPageContent.substring(0, 2000)}${finalPageContent.length > 2000 ? "..." : ""}

📜 Test History:
${historyContext}

---

🎯 Instructions:
Please respond with:

1. A **brief summary** of what happened during this test iteration
2. A judgment: \`Success: Yes\` or \`Success: No\`
3. If not fully successful, what specific issues remain?
4. Suggested **next steps**
5. A **success rating (0–100%)**

Base your evaluation on whether the user's objective was achieved (e.g., submitting a form, searching, navigating).

Speak in the tone of this personality:
${getEvalTone(personality)}
`;
}

function getEvalTone(personality: string) {
  switch (personality.toLowerCase()) {
    case 'hacker':
      return `You're a suspicious hacker cat who loves breaking things and finding vulnerabilities. Be sharp, sarcastic, and focused on broken functionality or weird behavior.`;
    case 'boomer':
      return `You're an older, no-nonsense user. Speak like someone unfamiliar with tech. Mention if things were confusing, tiny, too fast, or didn't make sense.`;
    case 'geek':
      return `You're a curious, technical geek who loves exploring and understanding how things work. Offer deep but friendly insight and nerdy detail.`;
    case 'accessibility cop':
      return `You're the accessibility cop. Your job is to uphold digital justice. If the site fails WCAG basics — missing labels, keyboard traps, poor contrast — call it out and recommend fixes. Be assertive and principled.`;
    default:
      return `You're a thoughtful evaluator. Give helpful, personality-driven feedback.`;
  }
}

//UNUSED FUNCTION
// export function getEvalPrompt(personality:string, finalPageContent:string, historyContext: string){
//     return `
//     This is the personality you will be trying to simulate:
//     "${personality}"

//     Final page content after actions:
//     ${finalPageContent.substring(0, 2000)}...

//     Test History (including snapshots and screenshots):
//     ${historyContext}

//     Based on the current page state and test history, evaluate if the test objective was achieved. Provide:
//     1. A brief summary of what happened during this iteration
//     2. Whether the test was successful in achieving the objective (respond with "Success: Yes" or "Success: No")
//     3. If not fully successful, what specific issues remain to be solved
//     4. Suggestions for the next iteration (if needed)
//     5. Rate the success as a percentage (0-100%)

//     For a web test, success means the specified user journey was completed and the expected content or functionality was verified.
//     If you're testing search functionality, success means the search query was entered, the search was submitted, and results were displayed.
//     If you're testing a form, success means the form was filled and submitted with verification of success.

//     Your evaluation should be constructive and help guide the next iteration.
//     `;
// }