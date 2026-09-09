# Cleanup Audit

A working checklist of code-quality findings to fix step by step. Generated 2026-09-09 from four tools; check items off as they're fixed, and re-run the underlying tool afterward to confirm.

All commands below run from `app/`.

| Tool | Command | What it catches |
| --- | --- | --- |
| ESLint | `npm run lint` | Style/correctness rules, incl. `sonarjs` and import ordering |
| React Doctor (`improve-react` skill) | `npx react-doctor@latest --json` | React-specific bugs, perf, a11y, security, maintainability |
| knip | `npm run knip` | Unused files, dependencies, exports |
| jscpd | `npm run jscpd` | Copy-pasted/duplicated code |

Findings below were manually vetted against the actual code (per the `improve-react` skill's Hard Rules) — items marked *noise* are technically flagged but judged not worth fixing; they're kept visible rather than deleted so the reasoning isn't lost.

---

## 1. React Doctor audit (score 70/100 — "Needs work", 15 findings)

### Accessibility
- [ ] `src/routes/dashboard/Dashboard.tsx` → `components/ui/Form.tsx:45` — the param-input `<label>` has no `htmlFor`/wrapped control, so screen readers can't associate it with the input. **This is the main "add param" form on the primary dashboard screen — highest-leverage a11y fix in this list.**
- [ ] `src/routes/dashboard/components/Params.tsx:232` — the per-row "more actions" `Button` (dots icon) has no `aria-label`, unlike the identical pattern in `Header.tsx:59` (`aria-label="More actions"`). Repeats once per saved param row.
- [ ] `src/routes/import-params/ImportParamsForm.tsx:59` — the click-to-select-file `<div>` has an `onClick` but no `role`/keyboard handler, so it's not reachable by keyboard.
- [ ] `src/components/layout/Main.tsx:9` — redundant `role="main"` on a `<main>` element; delete the attribute.
- [ ] `src/components/ui/Form.tsx:44` — redundant `role="form"` on a `<form>` element; delete the attribute.

### Bugs & correctness
- [ ] `src/utils/utils.ts:33-35` (`updateTab`) — `storagePersisted.get('preferences')` and `getCurrentTabParams()` are awaited sequentially but don't depend on each other; run them with `Promise.all`. This is the core "duplicate tab" action path.
- [ ] `src/routes/dashboard/components/UpdateInfo.tsx:56` — array index used as `key` in `features.map`. *Noise*: `features` comes from the static `CHANGELOG` constant, never reordered/filtered at runtime — safe as-is, but a one-line fix (`key={feature.title}`) if touching the file anyway.

### Performance
- [ ] `src/components/theme-provider.tsx:51-57` — the context `value` object is a new literal every render, so every `useTheme()` consumer re-renders on any `ThemeProvider` re-render. Wrap in `useMemo`.
- [ ] `src/components/ui/toggle-group.tsx:25` — same unstable-context-value pattern. *Low priority*: this file matches shadcn/ui's upstream source verbatim; fixing it diverges from the vendored component.
- [ ] `src/routes/dashboard/components/Params.tsx:41,265` — `selectedGroup.items.includes(param.id)` inside a `.filter`/`.map`. *Noise*: a user's saved params/groups are realistically tens of items, not thousands — converting to a `Set` is premature here.

### Maintainability
- [ ] `src/routes/dashboard/components/Params.tsx:56` — `handleCopy` closes over no component state, only its `param` argument; hoist it out of `ParamsList` to module scope so it isn't recreated every render.
- [ ] `src/hooks/useParamsShortcut.test.tsx:3` — imports `act` from `react-dom/test-utils`, which is removed in React 19. Switch to `import { act } from 'react'` now, ahead of any future React 19 upgrade.
- [ ] `src/components/ui/button.tsx:49`, `src/components/ui/toggle.tsx:38` — non-component exports (`buttonVariants`, `toggleVariants`) break Fast Refresh. *Low priority*: standard shadcn/ui generator output, appears in virtually every shadcn install; leave as-is unless the flicker-on-save actually bothers you.

---

## 2. ESLint (`npm run lint` — 54 problems: 1 error, 53 warnings)

- [ ] Run `npx eslint . --fix` — resolves ~50 of the 53 warnings automatically (all the `simple-import-sort/imports` and `/exports` findings across nearly every `src/**` file, including `Header.tsx`).
- [ ] `src/utils/utils.ts:9` (`sonarjs/no-nested-template-literals`, **error**) — `` `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ''}` `` nests a template literal; extract the port suffix to its own variable first.
- [ ] `src/components/theme-provider.tsx:66`, `button.tsx:49`, `toggle.tsx:38` (`react-refresh/only-export-components`) — same three files as the maintainability findings above; fixing the context-memoization / hoisting issues there would also need a look at whether to split these files, but see the *low priority* notes above for the two shadcn files.

**Known gap:** `eslint-plugin-jsx-a11y` was *not* installed — its latest release (6.10.2) caps peer support at ESLint ^9, and this repo is on ESLint ^10.8. Revisit once it ships ESLint 10 support (`npm view eslint-plugin-jsx-a11y peerDependencies`).

---

## 3. knip (`npm run knip`)

- [ ] **`@anthropic-ai/claude-code` is listed under `dependencies`** in `app/package.json` — it's a CLI dev tool, not something this Chrome extension should ship as a runtime dependency. Move to `devDependencies` or remove.
- [ ] `vite-plugin-static-copy` — not referenced anywhere in `vite.config.ts`; genuinely unused, safe to remove.
- [ ] `@types/string-hash` — no corresponding `string-hash` runtime dependency exists at all; orphaned, safe to remove.
- [ ] `eslint-config-prettier`, `eslint-plugin-prettier` — installed but never wired into `eslint.config.js` (no prettier plugin/config block present). Either add them to the config (so `npm run lint` also flags formatting) or remove them since `npm run format` already covers Prettier separately.
- [ ] Unused shadcn primitives — `src/components/ui/table.tsx`, `toggle.tsx`, `toggle-group.tsx`, `tooltip.tsx` (and their radix deps `@radix-ui/react-toggle`, `@radix-ui/react-toggle-group`, `@radix-ui/react-tooltip`) aren't imported anywhere in the app. Either they're for a feature not yet built, or safe to delete.
- [ ] Unused exports — `useTheme`, `buttonVariants`, several `Card*`/`Tabs*`/`DropdownMenu*` sub-components, `ToastAction`, `updateAllGroups`, `reducer` (see full `npm run knip` output). Mostly shadcn boilerplate exporting more than the app currently uses; low priority.
- [ ] **False positive to configure around, not fix**: knip flags `src/service-worker/service-worker.ts` as an unused file — it's the MV3 background entry point, built via the second entry in `vite.config.ts`, which knip doesn't know about without a `knip.json` declaring both entry points. Add one before trusting future knip runs on this repo.

---

## 4. jscpd (`npm run jscpd`)

- [ ] Only one trivial clone found (0.18% overall duplication): 7 lines of `beforeEach` boilerplate shared between `components/floating-popup.test.tsx:3-9` and `components/support-popup.test.tsx:3-9`. Optional — extract to a shared test helper if touching either file.

---

## 5. Header.tsx — `/simplify` review (2026-09-09)

Ran the `/simplify` skill (4 parallel review agents: reuse, simplification, efficiency, altitude) against `app/src/components/layout/Header.tsx` specifically, prompted by the "is this a mess or just my taste" question about its root/back-button ternary and dropdown menu. Findings only — not yet applied.

- [ ] `Header.tsx:78` — hardcoded Chrome Web Store support URL duplicates the identical literal in `src/components/support-popup.tsx:11` (and asserted in `support-popup.test.tsx:18`). Extract to a shared constant (e.g. `SUPPORT_URL` in `src/constants/index.ts`) and import it in both places.
- [ ] `Header.tsx:68` — `params?.length > 0` optional-chains over a value that can never be `undefined` (`params-slice.ts` types `data: Param[]` with initial `[]`). Simplify to `params.length > 0`.
- [ ] `Header.tsx:19,41` — `useAppSelector((state) => state.preferences)` selects the whole slice to read only `basicMode`. Narrow to `useAppSelector((state) => state.preferences.basicMode)` — flagged independently by both the simplification and efficiency passes: as written, Header (an always-mounted, app-shell component) re-renders whenever *any* preference changes (`newTab`, `sidePanel`, `showGroups`, `showForm` from Settings), not just `basicMode`.
- [ ] `Header.tsx:63-85` — the `DropdownMenu > Trigger(icon/round Button) > Content > Item(<Icon/> label)` composition duplicates the same skeleton in `routes/dashboard/components/Params.tsx:220-260` and `TabGroups.tsx` (icon-sizing classes like `[&_svg]:w-3 [&_svg]:h-3` copy-pasted per call site). Cross-file — a shared wrapper would need to touch those files too, so this wasn't applied; noted for a future pass.
- [ ] Structural/altitude: Header currently owns three unrelated jobs — (a) route-driven brand-vs-back-button layout, (b) a hand-maintained `PAGE_TITLES` route→title map that must be kept in sync by hand whenever a route changes elsewhere, (c) a global actions dropdown with a feature-state-aware conditional (`Export Parameters` gated on `state.params`). Root-cause fixes (route `handle` metadata read via `useMatches()` for titles; a params-feature-owned selector for the export gate) reach outside this one file, so they weren't applied — logged as a bigger architectural follow-up.
- [ ] Extracting the dropdown/actions menu into its own component (e.g. `HeaderActionsMenu.tsx` next to `Header.tsx`) is the one structural change that's actually proportionate to this file's size — matches the original "could this be a separate component" question, and doesn't require touching the router or Redux slices the way the other altitude findings do. Best candidate first step if this file gets revisited.

**Reviewed and confirmed as non-issues (no action needed):**
- The `isRoot` ternary (logo+brand vs. back-button+title) — extracting the two branches into named subcomponents would just move the same JSX and add prop-passing, not reduce complexity.
- Turning the four dropdown items into a data-driven config array — they aren't uniform (one is conditionally rendered, one renders an `<a>` via `asChild` instead of a click handler, one is a separator), so a config array would just move the same conditionals into a loop.
- The `state.params` selector — fine today (the slice has only one field, `data`), though it would become the same class of bug as the `preferences` selector above if a second field is ever added to `ParamsState`.
- The four inline `onClick` arrow functions — recreated every render, but noise here: no memoized children are being defeated, and these are cold, user-initiated click paths, not a hot render loop.

---

## Housekeeping (not part of the cleanup scope, noted in passing)

- `npm audit` reports 7 vulnerabilities (6 moderate, 1 high) in the `vitest`/`browserslist` devDependency chain, all with fixes available via `npm audit fix`. Unrelated to this audit's tooling additions — pre-existing.
