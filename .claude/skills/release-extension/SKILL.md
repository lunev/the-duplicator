---
name: release-extension
description: Build and package a new release of The Duplicator Chrome extension — bumps app/package.json's version to match app/public/manifest.json, runs the production build, and confirms the release zip was created. Only invoke when the user explicitly asks to release, build a release, or cut a new version.
disable-model-invocation: true
---

Release flow for The Duplicator (Chrome MV3 extension):

1. Read the `version` field in `app/public/manifest.json` — this is the source of truth for the release version. If the user asked to bump the version (e.g. "release 7.0.5"), update `app/public/manifest.json`'s `version` first.
2. Update `app/package.json`'s `version` field to match `app/public/manifest.json`'s `version` exactly. These two fields are maintained independently in this repo and must be kept in sync manually.
3. Run `npm run build` from inside `app/`. This runs `tsc -b` (typecheck), a production `vite build`, then `build-zip.js`, which zips the `app/build/` output into `chrome-webstore/releases/<name>-v<version>.zip` using the version from `app/public/manifest.json`.
4. Confirm the new zip exists at `chrome-webstore/releases/the-duplicator-v<version>.zip` (or the equivalent sanitized name `build-zip.js` produces) and report the path back to the user.
5. Do not use `app/scripts/release.js` or `app/scripts/buildPrev.js` — they are an unfinished, unwired-up work in progress and will fail (missing `zip-a-folder` dependency).
6. The resulting zip is meant to be committed to git (release zips under `chrome-webstore/releases/` are tracked in this repo) — stage and mention it, but don't commit or push without the user's explicit go-ahead.
