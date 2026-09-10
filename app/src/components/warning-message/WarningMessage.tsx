import { Cross1Icon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';

interface WarningMessageType {
  text: string;
  onClose: () => void;
}

const WarningMessage = ({ text, onClose }: WarningMessageType) => {
  return (
    <div className="mb-3 py-2 px-3 flex items-start gap-2 rounded text-xs bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
      <p>{text}</p>
      <Button
        className="p-1 h-auto min-h-0 w-auto min-w-0 [&_svg]:w-[12px] [&_svg]:h-[12px] text-orange-700 dark:text-orange-300"
        aria-label="Close warning"
        size="icon"
        variant="link"
        onClick={onClose}
      >
        <Cross1Icon />
      </Button>
    </div>
  );
};

export default WarningMessage;
