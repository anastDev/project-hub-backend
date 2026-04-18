export const COMMIT_PROMPT = (prevCode: string, newCode: string, context?: string) : string => {  let prompt = `You are a conventional commit message generator.

Analyze the following text changes and generate a commit message following these rules exactly:

The commit message should describe WHAT was added/changed.

CRITICAL FORMATTING RULES:
- Use ONLY hyphens (-) for list items, NEVER em dashes (—) or asterisks (*)
- NO markdown formatting (no **bold**, no backticks, no headings)
- NO explanatory text before or after the commit message
- NO phrases like "Here's your commit message" or "I generated this"

FORMAT:
<type>[optional scope]: <description>
[optional body]

RULES:
1. Description must be lowercase, imperative mood ("add" not "added"), no trailing period
2. Body lines max 72 characters. Explain WHY, not WHAT. Only include if the change needs context
3. Blank line between subject and body
4. Choose ONE type from: feat, fix, refactor, style, test, docs, chore, build, ci, perf
5. Only add a scope if it's obvious (e.g. auth, api, db, ui, middleware). If unsure, omit it
6. For breaking changes: append ! after type and add BREAKING CHANGE: in the body
7. Return ONLY the commit message — no explanations, no reasoning, no markdown, no extra text
8. If a File/Context is provided below, put it INSIDE the parentheses as the scope
`;

if (context) {
    prompt += `File/Context: ${context}\n\n`;
}

prompt += `OLD TEXT:
${prevCode}

NEW TEXT:
${newCode}`;

  return prompt;
};