import { ArchiveIcon, DrawingPinIcon, ExternalLinkIcon, FileIcon, FontBoldIcon } from '@radix-ui/react-icons';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Switch } from '@/components/ui/switch';
import { togglePreference } from '@/features/preferences/preferences-slice';
import { showToast } from '@/utils/utils';

interface PreferenceRow {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  disabled: boolean;
  toggle: () => void;
}

const Settings = () => {
  const preferences = useAppSelector((state) => state.preferences);
  const { data: params } = useAppSelector((state) => state.params);
  const dispatch = useAppDispatch();

  const settings: PreferenceRow[] = [
    {
      id: '1',
      label: 'Form',
      description: 'Show the form for adding new URL parameters',
      icon: <FileIcon />,
      enabled: preferences.showForm,
      disabled: preferences.basicMode || params.length === 0,
      toggle: () => dispatch(togglePreference({ property: 'showForm' })),
    },
    {
      id: '2',
      label: 'Groups',
      description: 'Show the groups tab and selector',
      icon: <ArchiveIcon />,
      enabled: preferences.showGroups,
      disabled: preferences.basicMode,
      toggle: () => dispatch(togglePreference({ property: 'showGroups' })),
    },
    {
      id: '3',
      label: 'Basic Mode',
      description: 'Open links without saving them as parameters',
      icon: <FontBoldIcon />,
      enabled: preferences.basicMode,
      disabled: false,
      toggle: () => {
        dispatch(togglePreference({ property: 'basicMode' }));
      },
    },
    {
      id: '4',
      label: 'External Link',
      description: 'Open duplicated links in a new browser tab',
      icon: <ExternalLinkIcon />,
      enabled: preferences.newTab,
      disabled: false,
      toggle: () => {
        dispatch(togglePreference({ property: 'newTab' }));
      },
    },
    {
      id: '5',
      label: 'Side Panel',
      description: "Open the extension in the browser's side panel",
      icon: <DrawingPinIcon />,
      enabled: preferences.sidePanel,
      disabled: false,
      toggle: () => {
        dispatch(togglePreference({ property: 'sidePanel' }));
        chrome.sidePanel.setPanelBehavior({
          openPanelOnActionClick: !preferences.sidePanel,
        });
        showToast(
          <>
            <strong>Note:</strong> Reopen the extension to apply side panel settings
          </>,
        );
      },
    },
  ];

  return (
    <div>
      {settings.map((s) => (
        <div key={s.id} className="flex items-center justify-between gap-3 py-2 border-b last:border-0">
          <div className="flex min-w-0 items-center gap-2">
            <span className="text-muted-foreground [&_svg]:h-[14px] [&_svg]:w-[14px]">{s.icon}</span>
            <div className="min-w-0">
              <div className="text-xs font-medium">{s.label}</div>
              <div className="text-xxs text-muted-foreground">{s.description}</div>
            </div>
          </div>
          <Switch checked={s.enabled} disabled={s.disabled} onCheckedChange={s.toggle} aria-label={s.label} />
        </div>
      ))}
    </div>
  );
};

export default Settings;
