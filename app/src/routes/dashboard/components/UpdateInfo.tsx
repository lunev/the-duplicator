import { CheckCircledIcon, Cross1Icon, RocketIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { STORAGE_KEYS } from '@/constants';
import { CHANGELOG } from '@/constants/changelog';

const UpdateInfo = () => {
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
    <div className="fade-in relative mb-3 rounded-xl border border-sky-200 bg-linear-to-br from-sky-50 to-blue-100 p-4 text-xs shadow-soft dark:border-sky-900 dark:from-sky-950 dark:to-blue-950">
      <Button
        className="absolute right-2 top-2 h-auto min-h-0 w-auto min-w-0 p-1 text-sky-700/70 hover:text-sky-700 dark:text-sky-300/70 dark:hover:text-sky-300 [&_svg]:h-3 [&_svg]:w-3"
        aria-label="Close"
        size="icon"
        variant="link"
        onClick={handleClose}
      >
        <Cross1Icon />
      </Button>

      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white shadow-sm dark:bg-sky-600">
          <RocketIcon className="h-3.5 w-3.5" />
        </span>
        <div>
          <h2 className="text-xxs font-bold uppercase tracking-wide text-sky-700 dark:text-sky-300">{title}</h2>
          <span className="text-sm font-bold text-sky-900 dark:text-sky-100">v{version}</span>
        </div>
      </div>

      <ul className="space-y-2.5 pr-4">
        {features.map((feature, index) => (
          <li key={index} className="flex gap-2">
            <CheckCircledIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-600 dark:text-sky-400" />
            <div>
              {feature.title && <p className="font-bold text-sky-900 dark:text-sky-100">{feature.title}</p>}
              {feature.description && <p className="text-sky-800/80 dark:text-sky-200/80">{feature.description}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpdateInfo;
