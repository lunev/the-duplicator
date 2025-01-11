import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { togglePreference } from '@/features/preferences/preferences-slice';
import BaseSwitch from '@/components/ui/switch/BaseSwitch';

const Preferences: React.FC = () => {
  const preferences = useAppSelector((state) => state.preferences);
  const dispatch = useAppDispatch();

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
      <div className="mb-5">
        <h3 className="font-bold mb-2">Manage URL Parameters</h3>
        <div className="mb-2 flex gap-2">
          <button
            aria-label="Import"
            onClick={() => chrome.runtime.openOptionsPage()}
            className="btn-outlined"
          >
            Import
          </button>
          <button
            aria-label="Export"
            onClick={() => chrome.runtime.openOptionsPage()}
            className="btn-outlined"
          >
            Export
          </button>
          <button
            aria-label="Clear All"
            onClick={() => chrome.runtime.openOptionsPage()}
            className="btn-warning"
          >
            Clear All
          </button>
        </div>
        <div className="mb-2">
          <button
            aria-label="Options page"
            onClick={() => chrome.runtime.openOptionsPage()}
            className="text-sky-500"
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
