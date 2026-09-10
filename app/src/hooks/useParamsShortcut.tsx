import { useEffect } from 'react';

import { Param } from '@/types';

interface KeyboardParams {
  params: Param[];
  handleOpenTab: (title: string) => void;
  setKeydownWarning: (value: boolean) => void;
}

const useParamsShortcut = ({ params, handleOpenTab, setKeydownWarning }: KeyboardParams) => {
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      // Ignore if input or button is focused or no tabs available
      if (
        params.length === 0 ||
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLButtonElement
      ) {
        return;
      }

      const keyNumber = parseInt(event.key);
      if (!isNaN(keyNumber) && keyNumber >= 1 && keyNumber <= 9) {
        const index = keyNumber - 1;
        if (index < params.length) {
          handleOpenTab(params[index].title);
        } else {
          setKeydownWarning(true);
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [params, handleOpenTab, setKeydownWarning]);
};

export default useParamsShortcut;
