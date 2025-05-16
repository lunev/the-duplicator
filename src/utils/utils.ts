import { Param } from '@/types';
import { storagePersisted } from './storagePersisted';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export const getFullURL = (currentTabUrl: string = '', urlParam: string) => {
  try {
    const url = new URL(currentTabUrl);
    const domainUrl = `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ''}`;
    return `${domainUrl}${urlParam}`;
  } catch (error) {
    console.log('Invalid URL:', currentTabUrl, error);
  }
};

export const getCurrentTabParams = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs && tabs.length > 0) {
    const { url, index } = tabs[0];
    return { url, index };
  }
};

export const createTab = async (urlParam: string) => {
  const currentTab = await getCurrentTabParams();
  if (currentTab) {
    const { url, index } = currentTab;
    const fullNewUrl = getFullURL(url, urlParam);
    chrome.tabs.create({ url: fullNewUrl, index: index + 1 });
  }
};

export const updateTab = async (urlParam: string) => {
  const preferences = await storagePersisted.get('preferences');
  const currentTab = await getCurrentTabParams();
  if (currentTab) {
    const { url } = currentTab;
    const fullNewUrl = getFullURL(url, urlParam);
    chrome.tabs.update({ url: fullNewUrl }, () => {
      if (!preferences.sidePanel) {
        window.close();
      }
    });
  }
};

export const mergeParams = (oldParams: Param[], importedParams: Param[]): Param[] => {
  const uniqueItems = new Map<string, Param>();

  oldParams.forEach((item) => {
    uniqueItems.set(item.id, item);
  });

  importedParams.forEach((item) => {
    uniqueItems.set(item.id, item);
  });

  return Array.from(uniqueItems.values());
};

export const showToast = (description: React.ReactNode) => {
  toast({
    description,
    className: cn('fixed top-2 right-2 flex max-w-[300px]'),
    duration: 3000,
  });
};

export const handleExport = (params: Param[]) => {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-');

  const json = JSON.stringify(params, null, 2); // optional: pretty print
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const filename = `the_duplicator_parameters_${timestamp}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
};
