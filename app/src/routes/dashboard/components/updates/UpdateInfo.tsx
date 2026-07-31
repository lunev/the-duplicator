import { useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/constants';
import update from './update.json';
import styles from './UpdateInfo.module.css';
import { Button } from '@/components/ui/button';
import { Cross1Icon } from '@radix-ui/react-icons';

const UpdateInfo: React.FC = () => {
  const [updatesAvailable, setUpdatesAvailable] = useState<boolean>(false);
  const { title, version, features } = update.updateMessage;

  const handleClose = () => {
    setUpdatesAvailable(false);
    chrome.storage.sync.remove(STORAGE_KEYS.UPDATES_AVAILABLE);
  };

  useEffect(() => {
    const checkUpdates = async () => {
      try {
        const result = await chrome.storage.sync.get(STORAGE_KEYS.UPDATES_AVAILABLE);
        if (result[STORAGE_KEYS.UPDATES_AVAILABLE]) {
          setUpdatesAvailable(true);
        }
      } catch (error) {
        console.log('Error checking for updates:', error);
      }
    };
    checkUpdates();
  }, []);

  if (!updatesAvailable) return null;

  return (
    <div className={`${styles.updates} dark:bg-sky-950 dark:text-sky-300`}>
      <div className={styles.info}>
        <h2 className={styles.title}>
          {title} {version}
        </h2>
        <ul>
          {features.map((feature, index) => (
            <li className={styles.featureItem} key={index}>
              {feature.title && <strong className={styles.featureTitle}>{feature.title}</strong>}
              {feature.description && <p>{feature.description}</p>}
            </li>
          ))}
        </ul>
      </div>
      <Button
        className={`${styles.button} dark:text-blue-300`}
        aria-label="Close"
        size="icon"
        variant="link"
        onClick={handleClose}
      >
        <Cross1Icon />
      </Button>
    </div>
  );
};

export default UpdateInfo;
