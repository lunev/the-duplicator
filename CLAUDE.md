# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

The Duplicator is a Chrome Manifest V3 extension (popup + side panel + background service worker) for duplicating tabs with custom URL parameters. Built with React, Redux Toolkit, Vite, TypeScript, Tailwind, and shadcn/ui (Radix primitives).

## Repo layout

- `app/` — the entire buildable project: `package.json`, source, config, tests, build scripts. **Run all npm commands from inside `app/`, not the repo root.**
- `design/` — promotional art assets, not part of the build.
- `chrome-webstore/` — Chrome Web Store listing material: `releases/` (committed release zips), `description.txt` (store description, ≤16,000 chars, plain text), `short-description.txt` (store summary shown in search results/category pages, ≤132 chars, plain text), `testing-instructions.txt` (reviewer testing steps, ≤500 chars, plain text). All three `.txt` files must stay within those limits since they're pasted verbatim into Chrome Web Store form fields.

Two entry points, both defined in `app/vite.config.ts`:
- `index.html` → `src/main.tsx`/`src/App.tsx` — popup and side panel (both use the same page); routes include `/import-params` (JSON import) and `/settings` (preference toggles)
- `src/service-worker/service-worker.ts` — MV3 background service worker, built to a fixed `service-worker.js` filename (no content hash) since `public/manifest.json` references it by exact name

State persistence uses `redux-persist-webextension-storage`, not localStorage, since extension pages/workers don't share a single DOM storage context.

## Commands

Run from `app/`:
- `npm run dev` — Vite dev server with HMR, for the popup/side panel UI only — the background service worker won't run under it.
- `npm run watch` — `vite build --watch`. Watch-mode full-extension build, no HMR. Use this instead of `dev` when the service worker needs to run. After changes rebuild, reload the unpacked extension at `chrome://extensions`.
- `npm run build` — typecheck (`tsc -b`) → production `vite build`. Does not zip.
- **When iterating on changes you want to see live, start `npm run watch` (or `npm run dev` for popup/side-panel-only UI work) in the background for the session** — don't rely on a one-off `npm run build` at the end, since its output goes stale the moment you make another edit.
- `npm run release` — `npm run build`, then `scripts/release.js` zips `app/build/` into `chrome-webstore/releases/<name>-v<version>.zip`, using the version from `app/public/manifest.json`. This script is copy/paste-portable across the other extension repos in this account (manage-x, parents-reminder, 0hours) — keep it in sync if you improve it.
- `npm test` — Vitest in watch mode. `npm run test:coverage` — `vitest run --coverage`.
- `npm run lint` / `npm run format` — ESLint / Prettier.

## Versioning

`app/public/manifest.json`'s `version` field is the source of truth for releases (it's what `scripts/release.js` uses to name the release zip). Keep `app/package.json`'s `version` in sync with it manually when bumping.

## Gotchas

- Built release zips under `chrome-webstore/releases/*.zip` are intentionally committed to git as release artifacts. Don't run `npm run release` just to "verify" it works unless you intend to regenerate the current version's zip — it overwrites the zip in place with new (differently-timestamped) archive bytes even when the source is unchanged. Plain `npm run build` is safe to run at any time since it no longer touches the zip.
- Test coverage thresholds in `app/vite.config.ts` only apply to a narrow subset of `src/**` (many dirs like `src/features/*` are excluded) — don't treat the 80/70/80/85% thresholds as covering the whole codebase.
- No CI is configured (no `.github/workflows`) — there's no automated gate on lint/test/build.
