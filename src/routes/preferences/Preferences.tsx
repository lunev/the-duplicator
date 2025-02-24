import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { togglePreference } from '@/features/preferences/preferences-slice';
import BaseSwitch from '@/components/ui/switch/BaseSwitch';

const Preferences: React.FC = () => {
  const preferences = useAppSelector((state) => state.preferences);
  const dispatch = useAppDispatch();

  const handleChangeSidePanelOptions = () => {
    dispatch(togglePreference({ property: 'sidePanel' }));
    chrome.sidePanel.setPanelBehavior({
      openPanelOnActionClick: !preferences['sidePanel'],
    });
  };

  return (
    <div data-testid="preferences">
      <h1 className="sr-only">Preferences</h1>
      <BaseSwitch
        className="mb-4"
        label="Basic mode"
        checked={preferences.basicMode}
        onChange={() => dispatch(togglePreference({ property: 'basicMode' }))}
        hint="Activate basic mode to open new tabs without saving them to your list."
      />
      <BaseSwitch
        className="mb-4"
        label="Open links in new tab"
        checked={preferences.newTab}
        onChange={() => dispatch(togglePreference({ property: 'newTab' }))}
        hint="Enable to open links in new tabs."
      />
      <BaseSwitch
        className="mb-4"
        label="Use side panel"
        checked={preferences.sidePanel}
        onChange={handleChangeSidePanelOptions}
        hint="Enable to open the extension in the side panel."
      />
      <div className="mb-5">
        <h3 className="font-bold mb-2">Manage URL Parameters</h3>
        <div className="mb-2 flex gap-2">
          <button
            aria-label="Import | options page"
            className="btn-outlined"
            onClick={() => chrome.runtime.openOptionsPage()}
          >
            Import
          </button>
          <button
            aria-label="Export | options page"
            className="btn-outlined"
            onClick={() => chrome.runtime.openOptionsPage()}
          >
            Export
          </button>
          <button
            aria-label="Clear All | options page"
            className="btn-warning"
            onClick={() => chrome.runtime.openOptionsPage()}
          >
            Clear All
          </button>
        </div>
        <div className="mb-2">
          <button
            aria-label="Options page"
            className="text-sky-500"
            onClick={() => chrome.runtime.openOptionsPage()}
          >
            <span className="underline">Go to Params Page</span> ↗
          </button>
          <p className="text-xs opacity-80">
            On the params page, you can <strong>export</strong> your parameters,{' '}
            <strong>import</strong> parameters from a file, or{' '}
            <strong>clear</strong> all your parameters.
          </p>
        </div>
      </div>

      <Link to="/" className="btn-outlined">
        &larr; Back to dashboard
      </Link>
    </div>
  );
};

export default Preferences;
