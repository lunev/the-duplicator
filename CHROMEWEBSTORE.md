# Chrome Web Store Compliance

Tracking file for Chrome Web Store submission requirements: permission justifications (single-purpose policy) and privacy-relevant data handling notes. Keep this in sync whenever `app/public/manifest.json` permissions change.

## Single Purpose

The Duplicator lets a user duplicate the current browser tab (or navigate it in place) while appending a custom URL parameter/path from a list the user defines and manages. Every permission below exists to support that one purpose.

## Permission Justifications

Current permissions declared in `app/public/manifest.json`: `["storage", "activeTab", "sidePanel"]`. No `host_permissions` are declared.

### `storage`

Used to persist the user's saved URL parameters, parameter groups, and UI preferences (e.g. open-in-new-tab vs. update-in-place, side panel mode, basic/advanced mode) locally via `chrome.storage.sync`, so the user's configured list survives popup/side-panel close and reload, and syncs across the user's own signed-in Chrome instances via Chrome Sync. Accessed in `app/src/utils/storagePersisted.ts`, `app/src/service-worker/service-worker.ts`, and via `redux-persist-webextension-storage` in `app/src/app/store.ts`. No alternative to `storage` exists for this — it is the only API for persisting extension state.

### `activeTab`

Used only to read the URL of the tab the user is currently viewing, and only in direct response to a user-invoked action (clicking the extension's popup/side-panel icon, or the `_execute_action` keyboard shortcut already declared in `manifest.json`). That URL is combined with the user's chosen parameter to build the new tab URL. All usage is in `app/src/utils/utils.ts`'s `getCurrentTabParams()`, `createTab()`, and `updateTab()`, called from user click/submit handlers in `app/src/routes/dashboard/Dashboard.tsx` and `app/src/routes/dashboard/components/params/Params.tsx`. The extension never queries, reads, or lists tabs other than the single active tab, and never does so from the background service worker outside a user gesture — this is exactly the scope `activeTab` is designed for. The broader `tabs` permission was previously requested but has been removed (see Finding F7) since it granted capabilities (URL access to all open tabs) the extension never uses.

### `sidePanel`

Used to offer the extension's UI as a Chrome side panel in addition to the default popup, per user preference (`preferences.sidePanel` in `app/src/features/preferences/preferences-slice.ts`). Declared via the `side_panel` manifest key and required for the `chrome.sidePanel` API used to open/configure that surface.

## Privacy-Relevant Data Handling

- **Data collected:** user-authored URL parameters/paths, parameter group names/membership, and UI preference toggles (new-tab vs. update-in-place, side panel on/off, basic mode, show groups, show form). No browsing history, page content, form data, or credentials are read or stored.
- **Where it's stored:** locally in the browser via `chrome.storage.sync`. If the user is signed into Chrome with sync enabled, this data is synced through Google's Chrome Sync infrastructure across that user's own devices, the same as any other extension using `chrome.storage.sync`.
- **External transmission:** none. The codebase makes no `fetch`/`XMLHttpRequest`/network calls of any kind (verified by search — no such call sites exist in `app/src`), and no `host_permissions` are declared. No data is sent to the developer or any third party.
- **Tab URL access:** the current tab's URL is read transiently (via `activeTab`) only to construct a new URL when the user clicks to duplicate/navigate; it is not persisted or transmitted anywhere.
