# UX Audit — The Duplicator

Source: full product/UX review by `ui-ux-product-reviewer`, 2026-08-05. Scope: whole extension (popup, side panel, options page, service worker, manifest) at `app/`.

Each entry below is tracked as a task in `docs/ux/roadmap.md`. IDs (`F#` = finding, `NF#` = new feature) match between the two documents.

---

## F1: Placeholder seed data ships to every install

**Problem:** `app/src/features/groups/groups-slice.ts:9-22` hardcodes two fake groups (`Group #1`, `Group #2`, both empty) into `initialState`. Because `preferences.showGroups` defaults to `true` (`preferences-slice.ts:14-20`), a first-time user opens the popup and immediately sees a `TabGroups` tab bar with `General | Group #1 | Group #2` before creating anything themselves.

**Why it matters:** Reads as broken/abandoned software — a classic "this looks like a demo, not a real product" first impression, affecting 100% of new installs. It also pollutes the "Move to group" submenu (`Params.tsx:164-184`) with meaningless targets from minute one.

**Suggested Solution:** Set `initialGroups: Group[] = []`. If sample groups are wanted for onboarding, gate them behind a one-time "Try Groups" CTA on the empty state instead of silent seed data.

**Status**: Open

---

## F2: `package.json` version out of sync with `manifest.json`

**Problem:** `app/package.json:4` reports `"version": "7.0.3"` while `app/public/manifest.json:5` reports `"7.0.4"`. `CLAUDE.md` documents that these must be kept in sync manually.

**Why it matters:** Silent drift is exactly how release tooling produces confusingly-named artifacts — `build-zip.js` names the release zip from `manifest.json`, so the npm package version stops being a trustworthy reference for what's actually shipped.

**Suggested Solution:** Bump `package.json` to `7.0.4` immediately. Consider a lightweight pre-build check that fails loudly if the two diverge again.

**Status**: Completed (2026-08-05)

**Implementation note:** Bumped `app/package.json`'s `"version"` from `7.0.3` to `7.0.4` to match `app/public/manifest.json`. As part of the release step for this fix, `manifest.json` was then patch-bumped to `7.0.5` (the standard per-release version bump), with `package.json` bumped to match, so both files remain in sync at `7.0.5`. The suggested pre-build drift check was not implemented — out of scope for this trivial fix; left as a possible future follow-up.

---

## F3: Dead, unstyled button components in the options folder

**Problem:** `app/src/options/buttons/ButtonClear.tsx`, `ButtonExport.tsx`, `ButtonImport.tsx` are not imported anywhere (verified via project-wide grep). They reference CSS classes `btn-warning`/`btn-outlined` (`ButtonClear.tsx:16`, `ButtonExport.tsx:23`, `ButtonImport.tsx:51`) that don't exist in `index.css`, any `.module.css`, or the Tailwind config — if ever rendered they'd show as bare unstyled HTML buttons.

**Why it matters:** Dead code increases maintenance burden, misleads contributors into thinking a "Clear All" feature already exists in the UI, and the CSS-class mismatch is a landmine for whoever re-enables them later.

**Suggested Solution:** Either delete the three files, or finish wiring them into the options page (see F4/NF6) restyled with the existing `Button` component from `app/src/components/ui/button.tsx`.

**Status**: Open

---

## F4: Options page has no identity, settings, or group management

**Problem:** `app/src/options/OptionsApp.tsx` is 12 lines: a `<div className="px-6 pb-6"><ImportParams /></div>`. No page heading, no logo, no link back to the extension. Preferences (`TogglePreferences`) only live in the popup `Header.tsx`; group CRUD only lives at `/groups`, itself only reachable from inside the popup; bulk delete is dead code (F3).

**Why it matters:** Chrome Web Store reviewers and users who land on `options.html` (via right-click → Options, or `chrome.runtime.openOptionsPage()` in `Header.tsx:30`) get a jarring, unbranded, single-purpose page that undersells the product and forces every other setting into the cramped 440px popup (`index.css:18`).

**Suggested Solution:** Give the options page a header matching `Header.tsx`'s branding; move preference switches there with full-width labels (not icon-only); add group management (reuse `Groups.tsx` logic); add Export/Clear All with a real `AlertDialog` confirmation (fine on the options page, unlike the popup).

**Status**: Open

---

## F5: No first-run/onboarding experience

**Problem:** There is no onboarding component anywhere in `src/`. A first-time user with zero params sees a header with 5 unlabeled icon toggles and, because `Params.tsx:92-97` force-shows the form when `params.length === 0`, a bare `<Form label="New URL Parameter" placeholder="Enter a URL parameter" .../>` (`Dashboard.tsx:37-48`). Nothing explains that "URL parameter" here means "everything after the domain" — `getFullURL` (`utils.ts:6-14`) discards the current path and keeps only protocol+hostname+port.

**Why it matters:** Most users would assume "duplicate tab with parameter" appends to the *existing* URL rather than replacing the path. Shipping this without a single example or tooltip guarantees confused first sessions and silent abandonment.

**Suggested Solution:** Add a one-time dismissible explainer above the form on the empty state, reusing the existing `WarningMessage`/`UpdateInfo` visual pattern (`UpdateInfo.tsx` is a ready-made template), with 1-2 example params and a note that the domain is preserved but the path is not.

**Status**: Open

---

## F6: Destructive actions have no confirmation or undo

**Problem:** `handleRemove` in `app/src/routes/dashboard/components/params/Params.tsx:67-75` and in `app/src/routes/groups/Groups.tsx:40-48` delete a param/group immediately on a single dropdown click, with only a 3-second toast (`showToast`, `utils.ts:61-67`) as feedback. `@radix-ui/react-alert-dialog` is installed (`package.json:18`) but never imported anywhere, and the toast primitive (`toast.tsx:48-61`) already supports an `action` slot that `showToast()` never populates.

**Why it matters:** One misclick on "Remove" in a crowded dropdown (sitting directly under "Edit") permanently deletes a saved param or group with no recovery path — a real data-loss risk, using components already in the dependency tree.

**Suggested Solution:** In the popup (no modal dialogs there per the standing popup constraint), add a `ToastAction` "Undo" button to the removal toast that re-dispatches an add/restore action. On the options page (F4), use the already-installed `AlertDialog` for "Clear All" and other bulk destructive actions.

**Status**: Open

---

## F7: `"tabs"` permission is broader than actual usage

**Problem:** `app/public/manifest.json:28` requests `["storage", "activeTab", "sidePanel", "tabs"]`. Every `chrome.tabs.*` call (`utils.ts:17,29,39`) only ever touches the single active tab, and only from within the popup/side panel — exactly the scenario `"activeTab"` alone covers.

**Why it matters:** The broad `"tabs"` permission triggers a stronger Chrome Web Store install warning than the extension's actual behavior warrants, hurting install conversion and inviting unnecessary reviewer scrutiny for a capability (reading all tabs) the code never exercises.

**Suggested Solution:** Drop `"tabs"`, keep `"activeTab"`. Verify `chrome.tabs.query({active:true,currentWindow:true})` still resolves `url` from within the popup context (it will — `activeTab` grants URL access to the tab active when the extension UI was invoked). Update `CHROMEWEBSTORE.md`/store justification for the permission change.

**Status**: Open

---

## F8: Toolbar icon is illegible at 16px

**Problem:** `app/public/icons/logo16x16.png`, viewed at actual size, renders as an ambiguous dark smudge inside a yellow circle. The abstract glyph reads cleanly at 128px (`logo128x128.png`) but loses all legibility at the 16-32px sizes users actually see (browser toolbar, `chrome://extensions`).

**Why it matters:** The toolbar icon is the single most-seen brand asset. An illegible icon makes the extension hard to spot among a crowded toolbar and communicates nothing about "duplicate" or "tabs."

**Suggested Solution:** Simplify the mark for small sizes — a bolder, higher-contrast glyph (e.g. a stacked-rectangles/duplicate-tab motif) that reads correctly at 16px. Keep the more detailed version only for 48/128px.

**Status**: Open

---

## F9: Header preference toggles are icon-only with no persistent labels

**Problem:** `TogglePreferences.tsx:24-94` defines 5 settings (Form, Groups, Basic Mode, External Link, Side Panel), each an icon-only `Toggle` (`TogglePreferencesItem.tsx:22-41`) whose meaning is conveyed only via a Radix `Tooltip` requiring hover. The `FontBoldIcon` used for "Basic Mode" (`TogglePreferences.tsx:46`) has no semantic connection to "open links without saving them."

**Why it matters:** Five unlabeled icons in a row, one with a misleading glyph, is a discoverability dead end for anyone who doesn't methodically hover each one. It also fails keyboard-only and touch users, who can't trigger `:hover` tooltips at all.

**Suggested Solution:** Add a labeled overflow menu as an alternative entry point (the `⋮` dropdown already exists in `Header.tsx:25-39`), or add short visible text labels — there's room at the popup's 440px width, since `Header.module.css:1-2` only budgets `p-4` and nothing enforces icon-only.

**Status**: Open

---

## F10: Group management becomes unreachable once hidden

**Problem:** The only in-context links to `/groups` (`TabGroups.tsx:44-49`) are conditionally rendered only when `preferences.showGroups` is `true` (`Dashboard.tsx:34`). If a user disables the "Groups" toggle in the header, there is no longer any visible entry point to `/groups` — the only way back is remembering that the same icon toggle re-enables the panel.

**Why it matters:** Hiding a feature panel also hides that panel's only management entry point, with the sole recovery path being the icon the user just consciously turned off — a genuine discoverability trap.

**Suggested Solution:** Keep a "Manage groups" entry in the `⋮` overflow menu in `Header.tsx:25-39` regardless of `showGroups` state, so group CRUD stays reachable even with the panel hidden.

**Status**: Open

---

## F11: Silent failure when the active tab's URL can't be parsed

**Problem:** `getFullURL` (`utils.ts:6-14`) wraps `new URL(currentTabUrl)` in a try/catch that only `console.log`s and returns `undefined`. Its callers, `createTab` (`utils.ts:24-31`) and `updateTab` (`utils.ts:33-45`), then call `chrome.tabs.create`/`chrome.tabs.update` with `url: undefined` and no guard, silently opening/keeping the New Tab Page instead of the intended URL.

**Why it matters:** A user pressing "Go" and landing on a blank New Tab Page with zero explanation looks like the extension is broken, not like their input was invalid.

**Suggested Solution:** If `fullNewUrl` is `undefined`, call the existing `showToast` (already used elsewhere in this same file's callers) with an explicit error instead of proceeding silently.

**Status**: Open

---

## F12: Fixed pixel widths don't adapt to the side panel's variable width

**Problem:** `Params.module.css:34` hardcodes `.paramLink { max-w-[360px] }`, and dropdown menus throughout (`Header.module.css:17-19`, `Params.module.css:45-47`, `TabGroups.module.css:21-23`, `Groups.module.css:25-27`) use fixed/content-based sizing. The same `index.html`/`App.tsx` renders in both the ~440px popup and the user-resizable Chrome side panel (`manifest.json:15-17`), but a wider side panel doesn't let long param titles use the extra horizontal space.

**Why it matters:** The side panel is a first-class, explicitly supported surface, but the layout is only tuned for the fixed popup width — wasting the side panel's main advantage (more room for long URLs/params).

**Suggested Solution:** Switch fixed max-widths to responsive/relative units (e.g. `max-w-[90%]` or a container query) so the side panel surface benefits from its extra width.

**Status**: Open

---

## F13: Export and Import live on asymmetric surfaces

**Problem:** In `Header.tsx:33-37`, "Export Parameters" is a same-popup, instant download gated by `params?.length > 0`. "Import Parameters" (`Header.tsx:30-32`) instead calls `chrome.runtime.openOptionsPage()`, forcing a full context switch to a new browser tab just to pick a file.

**Why it matters:** Two conceptually parallel actions (export/import the same JSON) live on completely different surfaces for no apparent technical reason — a `<Input type="file">` works fine inside a popup.

**Suggested Solution:** Bring Import into the popup as an inline flow (file picker triggers immediately, success/error shown as a toast or inline state — no modal, per the popup constraint), reserving the options page for bulk/administrative actions.

**Status**: Open

---

## NF1: Live URL preview

**Problem:** Users type into the param input (`Form.tsx`, placeholder "Enter a URL parameter") with no feedback on what the resulting URL will actually be, given the domain-only mental model baked into `getFullURL` (`utils.ts:6-14`).

**Why it matters:** Prevents mistakes and clarifies the non-obvious "path gets replaced, domain doesn't" behavior (related to F5) at the moment it matters most — while typing.

**Suggested Solution:** Show a live preview of the resulting full URL under the input, computed from the current active tab's domain plus the in-progress input value.

**Status**: Open

---

## NF2: Global per-slot keyboard shortcuts

**Problem:** The number-key shortcut system (`useParamsShortcut.tsx`, `KeyTooltip.tsx`) only works once the popup is already open.

**Why it matters:** Power users have to open the popup before they can use a shortcut at all, adding a mandatory extra step to the fastest path through the tool.

**Suggested Solution:** Register global commands via `chrome.commands` so a param slot can be triggered browser-wide without opening the popup first, extending the existing in-popup number-key pattern.

**Status**: Open

---

## NF3: Drag-and-drop reordering

**Problem:** `params-slice.ts`/`groups-slice.ts` only support add/remove/edit — there's no reorder action, so param/group order is fixed by creation order.

**Why it matters:** Users with more than a handful of params can't organize the list by frequency or priority, forcing them to scroll past rarely-used entries every time.

**Suggested Solution:** Add a reorder action to both slices and wire up drag-and-drop (or up/down controls as a lighter alternative) in the param and group lists.

**Status**: Open

---

## NF4: Search/filter box for the param list

**Problem:** The param list already gets a scroll container past 14 items (`Params.module.css:13-15`), but there's no way to filter it.

**Why it matters:** Scrolling through a long list to find one param is slower than typing a few characters, especially for users who've accumulated many saved params.

**Suggested Solution:** Add a filter input above the param list, once it exceeds roughly 10 items, that filters by param title/value as the user types.

**Status**: Open

---

## NF6: Bulk "Clear All" with confirmation

**Problem:** There's no way to clear all saved params/groups at once — the closest thing (`ButtonClear.tsx`, see F3) is dead, unwired code.

**Why it matters:** Users resetting the extension (e.g. before sharing a screenshot, or starting fresh) currently have to delete every param and group one at a time.

**Suggested Solution:** Wire a real "Clear All" action into the options page (F4), behind the already-installed `AlertDialog` confirmation, reusing the intent of the dead `ButtonClear.tsx` pattern.

**Status**: Open

---

## NF7: Manual theme toggle

**Problem:** `ThemeProvider` (`theme-provider.tsx`) is fully built and wired into `Root.tsx:9`, but no UI anywhere calls `setTheme` — the theme is permanently locked to `system`.

**Why it matters:** Users who want light/dark mode independent of their OS setting (a common preference) have no way to express it, despite the infrastructure already existing.

**Suggested Solution:** Add a `ToggleGroup` (already imported/used elsewhere as `toggle-group.tsx`) for light/dark/system, most naturally placed on the options page.

**Status**: Open

---

## NF8: Param templates / dynamic placeholder tokens

**Problem:** Saved params are static strings — there's no way to express a value that should vary per use (e.g. today's date, a random ID).

**Why it matters:** Power users (QA, growth marketing) often need slightly different values on each use; static-only params force them to maintain near-duplicate entries or edit by hand every time.

**Suggested Solution:** Support tokens like `{today}`, `{random_id}`, `{tab_url}` in saved param values, substituted at open-time — implementable without any remote network call, keeping MV3/CSP posture clean.

**Status**: Open

---

## NF9: Duplicate with all group params at once

**Problem:** There's no way to open every param in a group as separate tabs in a single action — each has to be triggered individually.

**Why it matters:** QA/testing workflows that need to check the same page across multiple environments (dev/staging/prod, each saved as a group param) currently require repeating the same click per param.

**Suggested Solution:** Add a "Duplicate all" action on the group view that opens one tab per param in that group.

**Status**: Open

---

## NF10: Recently used params (MRU)

**Problem:** The param list is ordered by creation, not usage — frequently-toggled params (e.g. `?env=staging`) can end up buried below rarely-used ones.

**Why it matters:** Users who repeatedly reach for the same 2-3 params still have to scroll or scan the full list every time.

**Suggested Solution:** Show a small "Recently used" section above the full param list, tracking the last N params actually opened.

**Status**: Open

---

## NF11: Favicon/domain badge per param

**Problem:** Params are stored as domain-agnostic strings with no indication of which site(s) they've historically been used on.

**Why it matters:** As the list grows, it becomes hard to tell at a glance which param applies to which site, especially for users managing params across many domains.

**Suggested Solution:** Track and display the favicon/domain a param was last used with as a small badge next to its row.

**Status**: Open

---

## NF12: Inline group creation from the "Move to group" submenu

**Problem:** `Params.tsx:164-184` only lists existing groups in the "Move to group" submenu — there's no "+ New group" entry, forcing a detour to `/groups` to create one first.

**Why it matters:** Adds an unnecessary round trip to a very common flow: moving a param into a group that doesn't exist yet.

**Suggested Solution:** Add a "+ New group" row to the submenu that creates the group inline and immediately moves the param into it.

**Status**: Open

---

## NF13: Context menu integration

**Problem:** The only way to duplicate a tab with a param is through the popup — there's no `chrome.contextMenus` entry point.

**Why it matters:** Power users who prefer right-click workflows have to break flow to open the popup even for a one-off duplication.

**Suggested Solution:** Add a right-click context menu on links/pages with a "Duplicate with param" submenu listing saved params, using `chrome.contextMenus`.

**Status**: Open

---

## NF14: Import/export as a shareable link or QR code

**Problem:** Import/export only supports JSON file transfer (`ImportParams.tsx`, `Header.tsx:33-37`).

**Why it matters:** Sharing a param set with a teammate currently requires sending a file, which is more friction than most team-sharing workflows expect.

**Suggested Solution:** Add an option to export as a shareable link or QR code encoding the same param/group data, alongside the existing file-based flow.

**Status**: Open

---

## NF15: Per-param color tags

**Problem:** The `chart-1`..`chart-5` CSS variables are already defined (`index.css:57-61`) but unused anywhere in the UI — there's no way to visually distinguish params at a glance.

**Why it matters:** A long, uncolored list of similarly-formatted param rows is harder to scan quickly than one with visual grouping cues.

**Suggested Solution:** Let users assign one of the existing chart colors as a tag on a param, shown as a small swatch/border in the list.

**Status**: Open

---

## NF16: Sync quota indicator

**Problem:** State is persisted via `chrome.storage.sync` (`store.ts:6-12`), which has small quota limits (100KB total, 8KB/item), but nothing in the UI indicates usage against that quota.

**Why it matters:** Power users with many params could silently hit the sync quota and have writes fail without any visible warning, risking silent data loss.

**Suggested Solution:** Add a subtle usage indicator (e.g. in the options page) that warns as stored data approaches the `chrome.storage.sync` quota.

**Status**: Open

---

## NF17: Onboarding checklist / tour

**Problem:** Beyond the one-time explainer in F5, there's no guided path introducing shortcuts, groups, and other core features to a new user.

**Why it matters:** A single static explainer covers the domain/path mental model, but doesn't help users discover the rest of the feature set (shortcuts, groups, side panel) they'd otherwise stumble on by accident or not at all.

**Suggested Solution:** Add a dismissible 3-step checklist card ("Add a param → Try a shortcut key → Create a group"), reusing the `UpdateInfo`-style banner pattern already in the codebase.

**Status**: Open

---

## NF18: "What's New" history page

**Problem:** `update.json` (`UpdateInfo.tsx`) only ever shows the latest version's release notes and is fully overwritten on each release — there's no way to see past changelog entries afterward.

**Why it matters:** Users who miss a specific release's notice (e.g. they didn't update right away) have no way to find out what changed in past versions.

**Suggested Solution:** Add a simple changelog history view, sourced from the same data `UpdateInfo.tsx` already consumes, accessible from the options page.

**Status**: Open

---

## NF19: Multi-select bulk actions

**Problem:** The param list only supports one-at-a-time actions via the per-row dropdown (move to group, delete, edit).

**Why it matters:** Reorganizing several params at once (e.g. moving five params into a new group) currently takes one dropdown interaction per param.

**Suggested Solution:** Add row selection (checkboxes or shift/cmd-click) with a bulk action bar for move-to-group and delete.

**Status**: Open

---

## NF20: AI-suggested param names

**Problem:** Params are saved with whatever title the user manually types; pasted raw query strings (e.g. `?utm_source=test&debug=1`) get no help becoming a readable label.

**Why it matters:** Cryptic query strings are hard to recognize in the list later without a descriptive title, and users often skip naming them well under time pressure.

**Suggested Solution:** Offer an auto-generated human-readable title suggestion (e.g. "Debug + UTM test") using a lightweight local heuristic — no network call needed, keeping MV3 remote-code restrictions clean.

**Status**: Open

---

## NF21: Cross-device sync visibility hint

**Problem:** `chrome.storage.sync` already gives params/groups cross-device sync for free, but nothing in the UI communicates that this is happening.

**Why it matters:** Users may not realize (or trust) that their data follows them across devices, undermining a real differentiator the extension already has for free.

**Suggested Solution:** Add a small "synced across devices" hint near settings on the options page.

**Status**: Open

---

## F14: `build-zip.js` is broken against the installed `archiver` version

**Problem:** `app/build-zip.js` imports `archiver` using the old default-export factory API (`import archiver from 'archiver'; archiver('zip', opts)`), but the installed `archiver@8.0.0` (`app/package.json:57`, `"archiver": "^8.0.0"`) removed that API in favor of class-based exports (`ZipArchive`, `TarArchive`, etc.). Running `node build-zip.js` — the final step of `npm run build` — throws `SyntaxError: The requested module 'archiver' does not provide an export named 'default'`.

**Why it matters:** `npm run build` cannot currently produce a release zip for anyone. This blocks the documented release process (`CLAUDE.md` — "production `vite build` → `build-zip.js` zips `app/build/` into `chrome-webstore/releases/<name>-v<version>.zip`") for every future version bump, discovered while validating [[F2]].

**Suggested Solution:** Update `build-zip.js` to `archiver`'s current class-based API, or pin `archiver` back to a `^7` version compatible with the existing default-export usage. Verify against a real build that `chrome-webstore/releases/<name>-v<version>.zip` is produced correctly afterward.

**Status**: Completed (2026-08-05)

**Implementation note:** Updated `app/build-zip.js` to archiver 8.x's class-based API rather than downgrading the dependency: `import archiver from 'archiver'` → `import { ZipArchive } from 'archiver'`, and `archiver('zip', { zlib: { level: 9 } })` → `new ZipArchive({ zlib: { level: 9 } })`. `ZipArchive extends Archiver` and only changes construction — all instance methods the script relies on (`.pipe()`, `.directory()`, `.finalize()`, `.pointer()`, `.on('error', ...)`) are inherited unchanged, so no other line needed to change. Verified by running `NODE_ENV=production npx vite build` followed by `node build-zip.js` directly (not via `npm run build`, since `tsc -b` still fails on `main` for the separate, pre-existing reasons tracked as [[F15]]) — this produced a correctly populated `chrome-webstore/releases/the-duplicator-v7.0.5.zip` (17 files: manifest.json, index.html, options.html, service-worker.js, assets/, icons/), then discarded that validation-only zip before cutting the real versioned release for this change. `npm run build` as a whole still won't complete end-to-end until F15 is fixed separately; that remains out of scope here.

---

## F15: `tsc -b` and `eslint` are both broken on `main`, independent of any code change

**Problem:** `npx tsc -b` fails with pre-existing type errors unrelated to any specific feature: a `react-router-dom` `future` prop type mismatch in `App.tsx`/`test-utils.tsx`, a `vite.config.ts` type overload error, and `useParamsShortcut.test.tsx` mock-typing errors. Separately, `npx eslint .` fails outright with `context.getSourceCode is not a function` — `eslint-plugin-react-hooks` is incompatible with the installed ESLint 10.8.0. Confirmed via `git stash` comparison that both failures pre-date and are unrelated to recent changes.

**Why it matters:** `npm run build` chains `tsc -b && vite build && ...`, so the typecheck gate alone already blocks the build pipeline before `build-zip.js` (see [[F14]]) is even reached. `npm run lint` is non-functional for anyone until the plugin/ESLint version mismatch is resolved, so lint regressions currently go undetected.

**Suggested Solution:** Fix or suppress the specific `tsc` errors (react-router-dom `future` prop typing, `vite.config.ts` overload, `useParamsShortcut.test.tsx` mocks) so `tsc -b` passes cleanly. Upgrade or pin `eslint-plugin-react-hooks` to a version compatible with the installed ESLint 10.8.0, or pin ESLint back to a compatible major version.

**Status**: Completed (2026-08-05)

**Implementation note:** `npx tsc -b` and `npx eslint .` both now exit 0.

- `src/App.tsx` / `test/test-utils.tsx`: removed the `future={{ v7_startTransition, v7_relativeSplatPath }}` prop from `<HashRouter>`/`<MemoryRouter>`. The installed `react-router-dom@7.18.2`'s types no longer expose a `future` prop at all — those flags were a v6→v7 migration opt-in, and v7 already defaults to that behavior, so this is a type-only cleanup with no runtime change.
- `vite.config.ts`: changed `import { defineConfig } from 'vite'` to `import { defineConfig } from 'vitest/config'` and removed the now-nonfunctional `/// <reference types="vitest" />` comment, which is the supported way to get the `test` config field typed against the installed `vitest@4.1.10`.
- `src/hooks/useParamsShortcut.test.tsx`: typed `handleOpenTab`/`setKeydownWarning` as `Mock<(title: string) => void>` / `Mock<(value: boolean) => void>` (imported from `vitest`) instead of the untyped `ReturnType<typeof vi.fn>`, and gave `vi.fn()` matching generics, so the mocks satisfy the real `KeyboardParams` callback signatures.
- `package.json`: bumped `eslint-plugin-react-hooks` from `^5.1.0-rc.0` (whose rule implementation calls the removed `context.getSourceCode()` API) to `^7.1.1`, which declares explicit `eslint@^10.0.0` peer support and preserves the same `configs.recommended.rules` shape `eslint.config.js` consumes. Also removed the unused `eslint-plugin-react` devDependency (never imported by `eslint.config.js`) whose peer-dependency range conflicted with ESLint 10 and was blocking `npm install` outright. Note: this bump also enables a new set of "React Compiler" lint rules bundled into `eslint-plugin-react-hooks`'s `recommended` preset (v5 only had `rules-of-hooks`/`exhaustive-deps`; v7 adds ~a dozen more, all at error severity) — the codebase currently passes them cleanly, but a future PR tripping one of these should know this version bump is why they're active.
- `src/hooks/use-toast.ts`: once eslint could actually run past `App.tsx` for the first time, it surfaced one genuine pre-existing `@typescript-eslint/no-unused-vars` finding in this vendored shadcn/ui file (`actionTypes` is only referenced via `typeof actionTypes`, a well-known shadcn pattern). Added a narrowly-scoped `eslint-disable-next-line` with a comment explaining why, rather than restructuring vendored boilerplate.
- `tsconfig.app.json`: added an `"exclude"` for the 3 test files that fail on the still-missing `@testing-library/user-event` module (`Header.test.tsx`, `TogglePreferences.test.tsx`, `TogglePreferencesItem.test.tsx`), with a comment pointing at [[F16]] as the tracked fix and noting the exclude should be removed once F16 lands. This is scoped to `tsc -b`'s typecheck only — `npx vitest run` still attempts and correctly fails on these 3 files exactly as F16 describes, since vitest resolves files via `vite.config.ts`'s `test` block, not `tsconfig.app.json`. **[[F16]] remains untouched and open** — its actual fix (installing the missing dependency) was explicitly out of scope for this pass.
- Verified: `npx tsc -b` exit 0, `npx eslint .` exit 0 (3 pre-existing, unrelated `react-refresh/only-export-components` warnings remain in vendored shadcn files — not errors, don't block), `NODE_ENV=production npx vite build` succeeds. `npx vitest run` is unchanged at 1/4 files passing (5/5 tests), the other 3 failing exactly as before on F16's missing dependency.

---

## F16: `@testing-library/user-event` is used but not installed

**Problem:** Three test files import `@testing-library/user-event`, but it's missing from `app/package.json` devDependencies and isn't installed in `node_modules`, so `npx vitest run` fails 3 of 4 test files outright with module-not-found errors.

**Why it matters:** A large fraction of the test suite currently cannot execute at all, meaning `npm test`/`npm run test:coverage` are silently blind to regressions in whatever those three files cover.

**Suggested Solution:** Add `@testing-library/user-event` to `app/package.json` devDependencies at a version compatible with the installed `@testing-library/react`, install it, and confirm all four test files run.

**Status**: Open

---

## NF22: Command palette (Cmd/Ctrl+K)

**Problem:** Beyond the number-key shortcuts (which top out around 9 params), there's no fast way to search and jump to a specific param or group once the list grows large.

**Why it matters:** This is the kind of signature power-user feature (Raycast/Linear-caliber) that meaningfully differentiates a productivity extension once the core list-based UI stops scaling.

**Suggested Solution:** Add a `cmdk`-based command palette in the popup for fuzzy-searching and opening any param or group by name, as a natural extension of the existing shortcut system.

**Status**: Open
