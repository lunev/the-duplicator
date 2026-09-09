import { handleExport } from '@/utils/utils';
import Header from './Header';
import { renderWithProviders, initialState } from '@test-utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@/utils/utils', () => ({
  handleExport: vi.fn(),
}));

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('Header', () => {
  it('displays header without "Basic Mode" badge by default', () => {
    renderWithProviders(<Header />);
    expect(screen.queryByText('Basic Mode')).not.toBeInTheDocument();
  });

  it('displays "Basic Mode" badge when basic mode is enabled', () => {
    renderWithProviders(<Header />, {
      preloadedState: {
        ...initialState,
        preferences: {
          ...initialState.preferences,
          basicMode: true,
        },
      },
    });
    const basicModeBadge = screen.getByText('Basic Mode');
    expect(basicModeBadge).toBeInTheDocument();
  });

  it('shows and triggers "Export Parameters" option in dropdown', async () => {
    renderWithProviders(<Header />);

    const user = userEvent.setup();

    const dropdownTriggerButton = screen.queryByTestId('dropdown-trigger');
    if (dropdownTriggerButton) {
      await user.click(dropdownTriggerButton);
    }

    const exportParamsButton = screen.getByText(/export parameters/i);
    expect(exportParamsButton).toBeInTheDocument();

    if (exportParamsButton) {
      await user.click(exportParamsButton);
      expect(handleExport).toHaveBeenCalled();
    }
  });

  it("hides 'Export Parameters' option when there are no parameters", async () => {
    renderWithProviders(<Header />, {
      preloadedState: {
        ...initialState,
        params: {
          data: [],
        },
      },
    });

    const user = userEvent.setup();

    const dropdownTriggerButton = screen.queryByTestId('dropdown-trigger');
    if (dropdownTriggerButton) {
      await user.click(dropdownTriggerButton);
    }

    await waitFor(() => {
      const exportParamsButton = screen.queryByText(/export parameters/i);
      expect(exportParamsButton).not.toBeInTheDocument();
    });
  });

  it('navigates to the import params page when "Import Parameters" is clicked', async () => {
    renderWithProviders(<Header />);

    const user = userEvent.setup();

    const dropdownTriggerButton = screen.queryByTestId('dropdown-trigger');
    if (dropdownTriggerButton) {
      await user.click(dropdownTriggerButton);
    }

    const importParamsButton = screen.getByText(/import parameters/i);
    if (importParamsButton) {
      await user.click(importParamsButton);
    }

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/import-params');
    });
  });
});
