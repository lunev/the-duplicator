import { fireEvent, render, screen, waitFor } from '@test-utils';
import Preferences from './Preferences';
import * as hooks from '@/app/hooks';
import * as slices from '@/features/preferences/preferences-slice';

beforeEach(() => {
  render(<Preferences />);
});

describe('Preferences Component', () => {
  it('displays the Preferences component with initial state', () => {
    const preferences = screen.getByTestId(/Preferences/i);
    expect(preferences).toBeInTheDocument();

    const heading = screen.getByText(/Preferences/i);
    expect(heading).toBeInTheDocument();
  });

  it('toggles preference state basicMode when checkbox is clicked', async () => {
    const checkbox = screen.getAllByRole('checkbox')[0];

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeChecked();

    const mockDispatch = vi.fn();
    const spyDispatch = vi
      .spyOn(hooks, 'useAppDispatch')
      .mockReturnValue(mockDispatch);
    const togglePreferenceSpy = vi.spyOn(slices, 'togglePreference');

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(checkbox).not.toBeChecked();
      expect(spyDispatch).toHaveBeenCalled();

      expect(togglePreferenceSpy).toHaveBeenCalled();
      expect(togglePreferenceSpy).toHaveBeenCalledWith({
        property: 'basicMode',
      });
    });

    spyDispatch.mockRestore();
    togglePreferenceSpy.mockRestore();
  });

  it('toggles preference state newTab when checkbox is clicked', async () => {
    const checkbox = screen.getByRole('checkbox', {
      name: 'Open links in new tab',
    });

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    const mockDispatch = vi.fn();
    const spyDispatch = vi
      .spyOn(hooks, 'useAppDispatch')
      .mockImplementation(() => mockDispatch);

    const togglePreferenceSpy = vi
      .spyOn(slices, 'togglePreference')
      .mockImplementation((payload) => ({
        type: 'preferences/togglePreference',
        payload,
      }));

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(checkbox).toBeChecked();
      expect(spyDispatch).toHaveBeenCalled();
      expect(togglePreferenceSpy).toHaveBeenCalled();
      expect(togglePreferenceSpy).toHaveBeenCalledWith({
        property: 'newTab',
      });
    });

    spyDispatch.mockRestore();
    togglePreferenceSpy.mockRestore();
  });

  it('opens options page when link is clicked', async () => {
    const optionsPageLinks = screen.queryAllByRole('button', {
      name: /options page/i,
    });

    const openOptionsPageSpy = vi.spyOn(chrome.runtime, 'openOptionsPage');

    optionsPageLinks.forEach((link) => {
      fireEvent.click(link);
    });

    await waitFor(() => {
      expect(openOptionsPageSpy).toHaveBeenCalled();
    });
  });
});
