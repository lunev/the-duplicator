<p align="center">
  <img src="design/logo/logo.png" width="96" alt="The Duplicator logo">
</p>

<h1 align="center">The Duplicator</h1>

<p align="center">
  A Chrome extension for duplicating tabs with custom URL parameters, keyboard shortcuts, and export/import.
</p>

<p align="center">
  <a href="https://chromewebstore.google.com/detail/the-duplicator/cmbkalfnmgbghjoghgcplcmcijbdijei">Install from the Chrome Web Store</a>
</p>

## Features

- **Advanced and basic modes** — manage a saved list of URL parameters, or add one-off parameters on the fly.
- **Unlimited extra URL parameters** — no cap on how many you configure.
- **Keyboard shortcuts** — `Ctrl/Cmd + Shift + L`, then a number key `1`-`9`, duplicates a tab with a specific saved parameter.
- **Export/import** — move your configured parameters between devices.

## Usage

1. Install the extension and pin it to the Chrome toolbar.
2. Open the tab you want to duplicate.
3. Click the extension icon, or press `Ctrl/Cmd + Shift + L`.
4. Type an extra URL parameter and click add (or press Enter).
5. Click a saved parameter in the popup, or press `Ctrl/Cmd + Shift + L` followed by its number key, to duplicate the tab with it applied.

## Development

Manifest V3 extension (popup + side panel + background service worker) built with React, Redux Toolkit, Vite, TypeScript, Tailwind, and shadcn/ui.

```sh
cd app
npm install
npm run dev     # Vite dev server for the popup/side panel only
npm run watch   # watch-mode build — no HMR; use this instead of `dev` when the service worker needs to run
```

Load it unpacked in Chrome: `chrome://extensions` → enable Developer mode → **Load unpacked** → select `app/build`.

| Command (run from `app/`) | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server for the popup/side panel only |
| `npm run watch` | Watch-mode full-extension build — use when the service worker needs to run |
| `npm run build` | Typecheck and production build |
| `npm run release` | Build, then zip into `chrome-webstore/releases/` for the Chrome Web Store |
| `npm test` | Run tests (watch mode); `npm run test:coverage` for a coverage report |
| `npm run lint` / `npm run format` | Lint / format with ESLint / Prettier |

See [`CLAUDE.md`](CLAUDE.md) for repo layout, versioning, and other conventions.

## Compatibility

Google Chrome on Windows and Mac.

## Changelog

All notable user-facing changes are listed here. Internal work like dependency upgrades, refactors, and build tooling is left out.

### 7.4.0 - 2026-08-14
- **Redesigned page header**: Settings, Import Parameters, and Groups now show a back arrow and the page title right in the header, replacing the old "Back to Dashboard" text link.

### 7.3.0 - 2026-08-12
- **Redesigned update banner**: The "What's New" banner now appears above your parameter list on every page, not just the dashboard, with a cleaner gradient card and checklist layout so new features are easy to scan.
- **Animated placeholder examples**: The "New URL Parameter" and "Group name" input fields now show rotating example text that types itself out — like `/admin` or `?ref=partner` — giving you ideas for what to enter.

### 7.2.1 - 2026-08-12
- Internal changes only (dependency security fix, dead code cleanup) — nothing new to see here.

### 7.2.0 - 2026-08-12
- **Redesigned Import Params**: Selecting a file now imports it automatically — no more separate Import button — with a toast notification confirming success or explaining what went wrong.
- **Smarter forms**: The Add/Go buttons are disabled until you've entered something, instead of letting you submit and then showing an error.
