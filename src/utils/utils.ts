import { Param } from '@/types';

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
  const currentTab = await getCurrentTabParams();
  if (currentTab) {
    const { url } = currentTab;
    const fullNewUrl = getFullURL(url, urlParam);
    chrome.tabs.update({ url: fullNewUrl }, () => window.close());
  }
};

export const mergeParams = (
  oldParams: Param[],
  importedParams: Param[],
): Param[] => {
  const uniqueItems = new Map<string, Param>();

  oldParams.forEach((item) => {
    uniqueItems.set(item.id, item);
  });

  importedParams.forEach((item) => {
    uniqueItems.set(item.id, item);
  });

  return Array.from(uniqueItems.values());
};
