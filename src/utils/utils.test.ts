import {
  getFullURL,
  mergeParams,
  getCurrentTabParams,
  createTab,
  updateTab,
} from './utils.ts';

describe('getCurrentTabParams', () => {
  it('return tabs info', async () => {
    vi.spyOn(chrome.tabs, 'query').mockResolvedValue([
      {
        url: 'https://www.google.com/',
        index: 1,
      } as unknown as chrome.tabs.Tab,
    ]);
    const currentTabParam = await getCurrentTabParams();
    expect(currentTabParam).toEqual({
      url: 'https://www.google.com/',
      index: 1,
    });
  });
});

describe('getFullURL', () => {
  it('returns the correct URL when the input URL already includes a protocol', () => {
    expect(
      getFullURL(
        'http://localhost:8080/events-search#/refresh":0.5340408649119499,"name":"","page":0,"size":10%7D',
        '/admin',
      ),
    ).toBe('http://localhost:8080/admin');
  });

  it('returns the correct URL by replacing the path after the domain', () => {
    expect(
      getFullURL(
        'https://demo.indeed.com/job/26579/Help-Desk-Administrator-Part-Time-Maryland-Md-Baltimore',
        '/admin',
      ),
    ).toBe('https://demo.indeed.com/admin');
  });

  it('logs an error if URL is not valid', () => {
    const logSpy = vi.spyOn(console, 'log');
    getFullURL('demo.indeed.com', '/admin');
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid URL:'),
      'demo.indeed.com',
      expect.any(Error),
    );
  });
});

describe('mergeParams utility function', () => {
  it('combines old and new parameters into a single array with the correct length', () => {
    const mockParamsOld = [
      { id: '1', title: '/admin/' },
      { id: '2', title: '/wp-admin/' },
    ];
    const mockParamsNew = [
      { id: '3', title: '/home/' },
      { id: '4', title: '/signup/' },
    ];
    const merged = mergeParams(mockParamsOld, mockParamsNew);
    expect(merged).toHaveLength(4);
    expect(merged).toEqual([
      { id: '1', title: '/admin/' },
      { id: '2', title: '/wp-admin/' },
      { id: '3', title: '/home/' },
      { id: '4', title: '/signup/' },
    ]);
  });
});

describe('createTab', () => {
  it('creates tab', async () => {
    await createTab('/admin/');
    expect(chrome.tabs.create).toHaveBeenCalledWith({
      url: 'https://www.google.com/admin/',
      index: 2,
    });
  });
});

describe('updateTab', () => {
  it('updates tab', async () => {
    await updateTab('/admin/');
    expect(chrome.tabs.update).toHaveBeenCalledWith(
      { url: 'https://www.google.com/admin/' },
      expect.any(Function),
    );
  });
});
