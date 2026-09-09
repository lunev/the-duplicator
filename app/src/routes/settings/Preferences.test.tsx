import Preferences from './Preferences';
import { initialState, renderWithProviders } from '@test-utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as hooks from '@/app/hooks';
import * as utils from '@/utils/utils';

describe('Preferences: Form switch', () => {
  it('renders in enabled state and dispatches on click', async () => {
    const dispatchSpy = vi.spyOn(hooks, 'useAppDispatch');

    renderWithProviders(<Preferences />);

    const user = userEvent.setup();

    const toggle = screen.queryByRole('switch', { name: 'Form' });
    expect(toggle).toHaveAttribute('data-state', 'checked');
    expect(toggle).not.toBeDisabled();

    await user.click(toggle!);

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalled();
    });
  });

  it('renders in disabled state when basic mode is on', () => {
    renderWithProviders(<Preferences />, {
      preloadedState: {
        ...initialState,
        params: {
          data: [],
        },
        preferences: {
          ...initialState.preferences,
          basicMode: true,
          showForm: false,
        },
      },
    });

    const toggle = screen.queryByRole('switch', { name: 'Form' });
    expect(toggle).toHaveAttribute('data-state', 'unchecked');
    expect(toggle).toBeDisabled();
  });
});

describe('Preferences: Basic Mode switch', () => {
  it('dispatches on click', async () => {
    const dispatchSpy = vi.spyOn(hooks, 'useAppDispatch');

    renderWithProviders(<Preferences />, {
      preloadedState: {
        ...initialState,
        preferences: {
          ...initialState.preferences,
          basicMode: true,
        },
      },
    });

    const user = userEvent.setup();

    const toggle = screen.queryByRole('switch', { name: 'Basic Mode' });
    expect(toggle).toHaveAttribute('data-state', 'checked');

    await user.click(toggle!);

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalled();
    });
  });
});

describe('Preferences: Side Panel switch', () => {
  it('dispatches, shows a toast, and updates the side panel behavior on click', async () => {
    const dispatchSpy = vi.spyOn(hooks, 'useAppDispatch');
    const showToastSpy = vi.spyOn(utils, 'showToast');

    renderWithProviders(<Preferences />, {
      preloadedState: {
        ...initialState,
        preferences: {
          ...initialState.preferences,
          sidePanel: true,
        },
      },
    });

    const user = userEvent.setup();

    const toggle = screen.queryByRole('switch', { name: 'Side Panel' });
    expect(toggle).toHaveAttribute('data-state', 'checked');

    await user.click(toggle!);

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalled();
      expect(showToastSpy).toHaveBeenCalled();
      expect(chrome.sidePanel.setPanelBehavior).toHaveBeenCalled();
    });
  });
});
