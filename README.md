<p align="center">
  <img src="design/logo/logo.png" width="96" alt="Tab Duplicator: Custom URL Parameters logo">
</p>

<h1 align="center">Tab Duplicator: Custom URL Parameters</h1>

<p align="center">
  A Chrome extension for duplicating tabs with custom URL parameters, keyboard shortcuts, and export/import.
</p>

<p align="center">
  <a href="https://chromewebstore.google.com/detail/the-duplicator/cmbkalfnmgbghjoghgcplcmcijbdijei">Install from the Chrome Web Store</a>
</p>

## Features

- **Advanced and basic modes** — manage a saved list of URL parameters, or add one-off parameters on the fly.
- **Unlimited extra URL parameters** — no cap on how many you configure.
- **Parameter groups** — organize saved parameters into groups and filter the list down to one group at a time.
- **Drag-to-reorder** — reorder saved parameters by dragging, since list order controls which number key triggers each one.
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

### 7.6.1 - 2026-09-10
- **Accessibility fixes**: The import-file picker, the per-parameter actions menu, and the "Add parameter" form are now fully keyboard- and screen-reader-accessible — these previously couldn't be operated without a mouse.

### 7.6.0 - 2026-09-09
- **New name**: Renamed to "Tab Duplicator: Custom URL Parameters" to be easier to find in the Chrome Web Store — same extension, same data, no action needed.
- **Drag-to-reorder**: Reorder your saved URL parameters by dragging the handle — list order determines which number key (1-9) opens each one, so you can put your most-used parameters first.

### 7.5.0 - 2026-08-28
- **Feedback & Support**: A dismissible corner prompt and a new "Support" item in the header menu now link directly to the Chrome Web Store support page, so you can ask a question, make a suggestion, or report a problem.
- **Copy parameter**: Each URL parameter now has a copy icon, revealed on hover, to quickly copy it to your clipboard.

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
