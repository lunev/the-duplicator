import * as TT from '@/components/ui/tooltip';
import styles from './KeyTooltip.module.css';

const KeyTooltip: React.FC<{ index: number }> = ({ index }) => {
  return (
    <>
      {index < 9 ? (
        <TT.Tooltip>
          <TT.TooltipTrigger>
            <div className={styles.key}>{index + 1}</div>
          </TT.TooltipTrigger>
          <TT.TooltipContent>
            <p>Shortcut key {index + 1}</p>
          </TT.TooltipContent>
        </TT.Tooltip>
      ) : (
        <div className={styles.key}>{index + 1}</div>
      )}
    </>
  );
};

export default KeyTooltip;
