import TogglePreferences from './TogglePreferences';
import { initialState, renderWithProviders } from '@test-utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as hooks from '@/app/hooks';
import * as utils from '@/utils/utils';

describe('TogglePreferences: showForm button', () => {
  it('renders in enabled state', async () => {
    const dispatchSpy = vi.spyOn(hooks, 'useAppDispatch');

    renderWithProviders(<TogglePreferences />);

    const user = userEvent.setup();

    const button = screen.queryByRole('button', { name: 'Form' });
    expect(button).toHaveAttribute('data-state', 'on');
    expect(button).not.toBeDisabled();

    await user.hover(button!);

    await waitFor(() => {
      const tooltip = screen.queryAllByText(/hide the form/i)[0];
      expect(tooltip).toBeInTheDocument();
    });

    await user.click(button!);

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalled();
    });
  });

  it('renders in disabled state', async () => {
    renderWithProviders(<TogglePreferences />, {
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

    const button = screen.queryByRole('button', { name: 'Form' });
    expect(button).toHaveAttribute('data-state', 'off');
    expect(button).toBeDisabled();
  });
});

describe('TogglePreferences: basicMode button', () => {
  it('renders in enabled state', async () => {
    const dispatchSpy = vi.spyOn(hooks, 'useAppDispatch');
    const showToastSpy = vi.spyOn(utils, 'showToast');

    renderWithProviders(<TogglePreferences />, {
      preloadedState: {
        ...initialState,
        params: {
          data: [],
        },
        preferences: {
          ...initialState.preferences,
          basicMode: true,
        },
      },
    });

    const user = userEvent.setup();

    const button = screen.queryByRole('button', { name: 'Basic Mode' });
    expect(button).toHaveAttribute('data-state', 'on');
    expect(button).not.toBeDisabled();

    await user.hover(button!);

    await waitFor(() => {
      const tooltip = screen.queryAllByText(/toggle basic mode/i)[0];
      expect(tooltip).toBeInTheDocument();
    });

    await user.click(button!);

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalled();
      expect(showToastSpy).toHaveBeenCalled();
    });
  });

  it('renders in disabled state', async () => {
    const dispatchSpy = vi.spyOn(hooks, 'useAppDispatch');
    const showToastSpy = vi.spyOn(utils, 'showToast');

    renderWithProviders(<TogglePreferences />, {
      preloadedState: {
        ...initialState,
        params: {
          data: [],
        },
        preferences: {
          ...initialState.preferences,
          basicMode: false,
        },
      },
    });

    const user = userEvent.setup();

    const button = screen.queryByRole('button', { name: 'Basic Mode' });
    expect(button).toHaveAttribute('data-state', 'off');
    expect(button).not.toBeDisabled();

    await user.hover(button!);

    await waitFor(() => {
      const tooltip = screen.queryAllByText(/toggle basic mode/i)[0];
      expect(tooltip).toBeInTheDocument();
    });

    await user.click(button!);

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalled();
      expect(showToastSpy).toHaveBeenCalled();
    });
  });
});

describe('TogglePreferences: sidePanel button', () => {
  it('renders in enabled state', async () => {
    const dispatchSpy = vi.spyOn(hooks, 'useAppDispatch');
    const showToastSpy = vi.spyOn(utils, 'showToast');

    renderWithProviders(<TogglePreferences />, {
      preloadedState: {
        ...initialState,
        preferences: {
          ...initialState.preferences,
          sidePanel: true,
        },
      },
    });

    const user = userEvent.setup();

    const button = screen.queryByRole('button', { name: 'Side Panel' });
    expect(button).toHaveAttribute('data-state', 'on');
    expect(button).not.toBeDisabled();

    await user.hover(button!);

    await waitFor(() => {
      const tooltip = screen.queryAllByText(/toggle opening extension in the side panel/i)[0];
      expect(tooltip).toBeInTheDocument();
    });

    await user.click(button!);

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalled();
      expect(showToastSpy).toHaveBeenCalled();
      expect(chrome.sidePanel.setPanelBehavior).toHaveBeenCalled();
    });
  });
});
