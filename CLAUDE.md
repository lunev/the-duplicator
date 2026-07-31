# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

The Duplicator is a Chrome Manifest V3 extension (popup + options page + side panel + background service worker) for duplicating tabs with custom URL parameters. Built with React, Redux Toolkit, Vite, TypeScript, Tailwind, and shadcn/ui (Radix primitives).

## Repo layout

- `app/` — the entire buildable project: `package.json`, source, config, tests, build scripts. **Run all npm commands from inside `app/`, not the repo root.**
- `design/` — promotional art assets, not part of the build.
- `chrome-webstore/` — Chrome Web Store listing material: `releases/` (committed release zips), `description.md` (store description, ≤16,000 chars, plain text), `testing-instructions.md` (reviewer testing steps, ≤500 chars, plain text). Both `.md` files must stay within those limits since they're pasted verbatim into Chrome Web Store form fields.

Three entry points, all defined in `app/vite.config.ts`:
- `index.html` → `src/main.tsx`/`src/App.tsx` — popup and side panel (both use the same page)
- `options.html` → `src/options/options.tsx` — options page
- `src/service-worker/service-worker.ts` — MV3 background service worker, built to a fixed `service-worker.js` filename (no content hash) since `public/manifest.json` references it by exact name

State persistence uses `redux-persist-webextension-storage`, not localStorage, since extension pages/workers don't share a single DOM storage context.

## Commands

Run from `app/`:
- `npm run dev` — `vite build --watch`. This is a **watch-mode build, not a dev server** — there's no HMR. After changes rebuild, reload the unpacked extension at `chrome://extensions`.
- `npm run build` — typecheck (`tsc -b`) → production `vite build` → `build-zip.js` zips `app/build/` into `chrome-webstore/releases/<name>-v<version>.zip`, using the version from `app/public/manifest.json`.
- `npm test` — Vitest in watch mode. `npm run test:coverage` — `vitest run --coverage`.
- `npm run lint` / `npm run format` — ESLint / Prettier.

## Versioning

`app/public/manifest.json`'s `version` field is the source of truth for releases (it's what `build-zip.js` uses to name the release zip). Keep `app/package.json`'s `version` in sync with it manually when bumping.

## Gotchas

- `app/scripts/release.js` and `app/scripts/buildPrev.js` are a **work-in-progress replacement** for `build-zip.js`/`extractZip.js`. They are not wired into any npm script and depend on `zip-a-folder`, which isn't installed — don't invoke them or suggest `npm run release` (doesn't exist). Don't delete them; they're mid-migration. They still target a `release/` folder relative to `app/`, not `chrome-webstore/releases/` — that hasn't been updated to match the new layout.
- Built release zips under `chrome-webstore/releases/*.zip` are intentionally committed to git as release artifacts. Don't run a production build just to "verify" it works unless you intend to regenerate the current version's zip — `build-zip.js` overwrites it in place with new (differently-timestamped) archive bytes even when the source is unchanged.
- Test coverage thresholds in `app/vite.config.ts` only apply to a narrow subset of `src/**` (many dirs like `src/features/*` are excluded) — don't treat the 80/70/80/85% thresholds as covering the whole codebase.
- No CI is configured (no `.github/workflows`) — there's no automated gate on lint/test/build.
