import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Toggle } from '@/components/ui/toggle';
import styles from './TogglePreferences.module.css';

interface TogglePreferencesType {
  label: string;
  icon: React.ReactNode;
  tooltip: string;
  enabled: 'on' | 'off';
  disabled: boolean;
  toggle: () => void;
}

const TogglePreferencesItem: React.FC<TogglePreferencesType> = ({
  label,
  icon,
  tooltip,
  enabled,
  disabled,
  toggle,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            aria-label={label}
            data-state={enabled}
            value={label}
            disabled={disabled}
            size="icon"
            className={styles.toggleButton}
            onClick={toggle}
          >
            {icon}
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TogglePreferencesItem;
