import { useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/constants';
import update from './update.json';

const UpdateInfo: React.FC = () => {
  const [updatesAvailable, setUpdatesAvailable] = useState<boolean>(false);
  const { title, features } = update.updateMessage;

  const handleClose = () => {
    setUpdatesAvailable(false);
    chrome.storage.sync.remove(STORAGE_KEYS.UPDATES_AVAILABLE);
  };

  useEffect(() => {
    const checkUpdates = async () => {
      try {
        const result = await chrome.storage.sync.get(
          STORAGE_KEYS.UPDATES_AVAILABLE,
        );
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
    <div className="mb-3 p-2 rounded-lg bg-sky-200 text-sky-500 relative dark:bg-slate-700 dark:text-sky-500">
      <h2 className="mb-2 font-bold">{title}</h2>
      <ul className="text-xs">
        {features.map((feature, index) => (
          <li className="mb-1" key={index}>
            <strong className="font-bold">{feature.title}</strong>
            {` `}
            {feature.description}
          </li>
        ))}
      </ul>
      <button
        className="btn-icon absolute right-1 top-1 w-6 h-6 inline-flex items-center justify-center text-lg"
        aria-label="Close"
        onClick={handleClose}
      >
        &times;
      </button>
    </div>
  );
};

export default UpdateInfo;
