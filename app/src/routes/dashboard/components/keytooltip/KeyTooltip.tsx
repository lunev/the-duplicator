import * as TT from '@/components/ui/tooltip';

const KEY_CLASS =
  'min-w-5 h-5 flex items-center justify-center px-1 text-xxs text-center border rounded drop-shadow-xs cursor-default';

const KeyTooltip: React.FC<{ index: number }> = ({ index }) => {
  return (
    <>
      {index < 9 ? (
        <TT.Tooltip>
          <TT.TooltipTrigger>
            <div className={KEY_CLASS}>{index + 1}</div>
          </TT.TooltipTrigger>
          <TT.TooltipContent>
            <p>Shortcut key {index + 1}</p>
          </TT.TooltipContent>
        </TT.Tooltip>
      ) : (
        <div className={KEY_CLASS}>{index + 1}</div>
      )}
    </>
  );
};

export default KeyTooltip;
