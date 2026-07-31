import { FileIcon } from '@radix-ui/react-icons';
import TogglePreferencesItem from './TogglePreferencesItem';
import { renderWithProviders } from '@test-utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('TogglePreferencesItem', () => {
  it('renders toggle button and shows tooltip', async () => {
    const mockToggleFn = vi.fn();

    renderWithProviders(
      <TogglePreferencesItem
        label="Example Toggle Button"
        icon={<FileIcon />}
        tooltip="Example Tooltip"
        enabled="on"
        disabled={false}
        toggle={mockToggleFn}
      />,
    );

    const user = userEvent.setup();

    const button = screen.queryByRole('button', { name: 'Example Toggle Button' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('data-state', 'on');
    expect(button).not.toHaveAttribute('disabled');

    await user.hover(button!);

    await waitFor(() => {
      const tooltip = screen.queryAllByText(/example tooltip/i)[0];
      expect(tooltip).toBeInTheDocument();
    });

    await user.click(button!);

    await waitFor(() => {
      expect(mockToggleFn).toHaveBeenCalled();
    });

    await user.unhover(button!);

    await waitFor(() => {
      expect(screen.queryByText(/example tooltip/i)).not.toBeInTheDocument();
    });
  });
});
