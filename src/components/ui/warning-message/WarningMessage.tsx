import { Button } from '@/components/ui/button';
import { Cross1Icon } from '@radix-ui/react-icons';
import styles from './WarningMessage.module.css';

interface WarningMessageType {
  text: string;
  onClose: () => void;
}

const WarningMessage: React.FC<WarningMessageType> = ({ text, onClose }) => {
  return (
    <div className={`${styles.warning} dark:bg-orange-950 dark:text-orange-300`}>
      <p>{text}</p>
      <Button
        className={`${styles.button} dark:text-orange-300`}
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
