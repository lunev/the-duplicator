import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { togglePreference } from '@/features/preferences/preferences-slice';
import { showToast } from '@/utils/utils';
import { ArchiveIcon } from 'lucide-react';
import { DrawingPinFilledIcon, DrawingPinIcon, ExternalLinkIcon, FileIcon, FontBoldIcon } from '@radix-ui/react-icons';
import styles from './TogglePreferences.module.css';
import TogglePreferencesItem from './TogglePreferencesItem';

interface PreferencesType {
  id: string;
  label: string;
  icon: React.ReactNode;
  tooltip: string;
  enabled: 'on' | 'off';
  disabled: boolean;
  toggle: () => void;
}

const TogglePreferences: React.FC = () => {
  const preferences = useAppSelector((state) => state.preferences);
  const { data: params } = useAppSelector((state) => state.params);
  const dispatch = useAppDispatch();

  const settings: PreferencesType[] = [
    {
      id: '1',
      label: 'Form',
      icon: <FileIcon />,
      tooltip: preferences.showForm ? 'Hide the form' : 'Show the form',
      enabled: preferences.showForm ? 'on' : 'off',
      disabled: preferences.basicMode || params.length === 0,
      toggle: () => dispatch(togglePreference({ property: 'showForm' })),
    },
    {
      id: '2',
      label: 'Groups',
      icon: <ArchiveIcon />,
      tooltip: preferences.showGroups ? 'Hide groups list' : 'Show groups list',
      enabled: preferences.showGroups ? 'on' : 'off',
      disabled: preferences.basicMode,
      toggle: () => dispatch(togglePreference({ property: 'showGroups' })),
    },
    {
      id: '3',
      label: 'Basic Mode',
      icon: <FontBoldIcon />,
      tooltip: 'Toggle basic mode (opens links without saving them)',
      enabled: preferences.basicMode ? 'on' : 'off',
      disabled: false,
      toggle: () => {
        dispatch(togglePreference({ property: 'basicMode' }));
        showToast(
          <>
            <strong>Basic Mode</strong> has been {preferences.basicMode ? 'deactivated' : 'activated'}
          </>,
        );
      },
    },
    {
      id: '4',
      label: 'External Link',
      icon: <ExternalLinkIcon />,
      tooltip: preferences.newTab ? 'Open links in the same tab' : 'Open links in a new tab',
      enabled: preferences.newTab ? 'on' : 'off',
      disabled: false,
      toggle: () => {
        dispatch(togglePreference({ property: 'newTab' }));
        showToast(
          <>
            Links will be opened in a <strong>{preferences.newTab ? 'same' : 'new'}</strong> tab
          </>,
        );
      },
    },
    {
      id: '5',
      label: 'Side Panel',
      icon: preferences.sidePanel ? <DrawingPinFilledIcon /> : <DrawingPinIcon />,
      tooltip: 'Toggle opening extension in the side panel',
      enabled: preferences.sidePanel ? 'on' : 'off',
      disabled: false,
      toggle: () => {
        dispatch(togglePreference({ property: 'sidePanel' }));
        chrome.sidePanel.setPanelBehavior({
          openPanelOnActionClick: !preferences['sidePanel'],
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
    <div className={styles.preferencesContainer}>
      {settings?.map((s) => (
        <TogglePreferencesItem
          key={s.id}
          label={s.label}
          icon={s.icon}
          tooltip={s.tooltip}
          enabled={s.enabled}
          disabled={s.disabled}
          toggle={s.toggle}
        />
      ))}
    </div>
  );
};

export default TogglePreferences;
