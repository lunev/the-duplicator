---
description: Implement an ad-hoc feature not tracked in the roadmap, with plan + implementation + validation + review
allowed-tools: Agent, Read, Edit, Write, Grep, Glob, LS, Bash
argument-hint: [feature description]
---

Implement the following feature end-to-end, ad-hoc (it is not tracked in
docs/ux/roadmap.md):

"$ARGUMENTS"

1. Use the extension-architect subagent to review the request and produce
   a short implementation plan, unless it's trivial enough to skip straight
   to implementation.
2. Use the frontend-implementer subagent to implement the plan.
3. Run from app/: npx tsc -b, npx eslint ., npx vitest run,
   NODE_ENV=production npx vite build.
4. If manifest.json permissions changed, update CHROMEWEBSTORE.md with a
   justification in the same pass.
5. Use the code-reviewer subagent on the modified files; fix any High/Critical
   findings and re-review.
6. Do not update docs/ux/roadmap.md or docs/ux/changelog.ts — this wasn't a
   roadmap item.
7. Do not commit or push. End with concrete manual test steps for Chrome,
   and state plainly that nothing was committed.
