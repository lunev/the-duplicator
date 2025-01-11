import { render, screen, fireEvent, waitFor, act } from '@test-utils';
import UpdateInfo from './UpdateInfo';
import { STORAGE_KEYS } from '@/constants';

afterEach(() => {
  chrome.storage.sync.clear();
});

describe('UpdateInfo', () => {
  it('should render the update information when updates are available', async () => {
    chrome.storage.sync.set({ [STORAGE_KEYS.UPDATES_AVAILABLE]: true });
    render(<UpdateInfo />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });
  });

  it('should close the update information when the close button is clicked', async () => {
    chrome.storage.sync.set({ [STORAGE_KEYS.UPDATES_AVAILABLE]: true });
    render(<UpdateInfo />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();
    act(() => {
      fireEvent.click(closeButton);
    });
    await waitFor(() => {
      expect(chrome.storage.sync.remove).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { level: 2 }),
      ).not.toBeInTheDocument();
    });
  });
});
