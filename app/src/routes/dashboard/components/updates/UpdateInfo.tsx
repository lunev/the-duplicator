import { useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/constants';
import { CHANGELOG } from '@/constants/changelog';
import { Button } from '@/components/ui/button';
import { Cross1Icon } from '@radix-ui/react-icons';

const UpdateInfo: React.FC = () => {
  const [updatesAvailable, setUpdatesAvailable] = useState<boolean>(false);
  const { title, version, features } = CHANGELOG;

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
    <div className="mb-3 py-2 px-3 flex gap-2 items-start rounded bg-sky-100 text-sky-700 relative text-xs dark:bg-sky-950 dark:text-sky-300">
      <div className="flex-1">
        <h2 className="mb-1 font-bold text-sm">
          {title} {version}
        </h2>
        <ul>
          {features.map((feature, index) => (
            <li className="mb-1" key={index}>
              {feature.title && <strong className="font-bold">{feature.title}</strong>}
              {feature.description && <p>{feature.description}</p>}
            </li>
          ))}
        </ul>
      </div>
      <Button
        className="p-1 h-auto min-h-0 w-auto min-w-0 [&_svg]:w-3 [&_svg]:h-3 text-sky-700 dark:text-blue-300"
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
