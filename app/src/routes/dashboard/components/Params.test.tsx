import { initialState, renderWithProviders } from '@test-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { Group } from '@/types';
import { createTab, showToast, updateTab } from '@/utils/utils';

import ParamsList from './Params';

vi.mock('@/utils/utils', () => ({
  createTab: vi.fn(),
  updateTab: vi.fn(),
  showToast: vi.fn(),
}));

const getRow = (title: string) => screen.getByRole('button', { name: title }).closest('.group') as HTMLElement;

describe('ParamsList', () => {
  it('shows "No params" when there are no saved params', () => {
    renderWithProviders(<ParamsList />, {
      preloadedState: { ...initialState, params: { data: [] } },
    });
    expect(screen.getByTestId('no-params')).toHaveTextContent('No params');
  });

  it('renders each saved param with its shortcut number', () => {
    renderWithProviders(<ParamsList />);
    expect(screen.getByRole('button', { name: '/admin/' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '/wp-admin/' })).toBeInTheDocument();
    expect(screen.getByTitle('Shortcut key 1')).toHaveTextContent('1');
    expect(screen.getByTitle('Shortcut key 2')).toHaveTextContent('2');
  });

  it('updates the current tab in place when the newTab preference is off', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ParamsList />);
    await user.click(screen.getByRole('button', { name: '/admin/' }));
    expect(updateTab).toHaveBeenCalledWith('/admin/');
    expect(createTab).not.toHaveBeenCalled();
  });

  it('opens a new tab when the newTab preference is on', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ParamsList />, {
      preloadedState: { ...initialState, preferences: { ...initialState.preferences, newTab: true } },
    });
    await user.click(screen.getByRole('button', { name: '/admin/' }));
    expect(createTab).toHaveBeenCalledWith('/admin/');
  });

  it('copies the param title to the clipboard', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ParamsList />);
    // userEvent.setup() installs its own clipboard stub on first use, so spy on
    // whatever ends up on navigator.clipboard rather than pre-seeding our own.
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    const copyButton = getRow('/admin/').querySelector('[aria-label="Copy"]') as HTMLElement;
    await user.click(copyButton);
    expect(writeText).toHaveBeenCalledWith('/admin/');
  });

  it('shows a destructive toast when copying to the clipboard fails', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ParamsList />);
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('denied'));
    const copyButton = getRow('/admin/').querySelector('[aria-label="Copy"]') as HTMLElement;
    await user.click(copyButton);
    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith('Failed to copy to clipboard', 'destructive');
    });
  });

  it('edits a param title via the dropdown menu', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ParamsList />);
    const moreButton = getRow('/admin/').querySelector('[aria-label="More actions"]') as HTMLElement;
    await user.click(moreButton);
    await user.click(screen.getByRole('menuitem', { name: /edit/i }));

    const input = screen.getByDisplayValue('/admin/');
    await user.clear(input);
    await user.type(input, '/wp-login/{Enter}');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '/wp-login/' })).toBeInTheDocument();
    });
  });

  it('does not save an edit when the title is cleared to blank', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ParamsList />);
    const moreButton = getRow('/admin/').querySelector('[aria-label="More actions"]') as HTMLElement;
    await user.click(moreButton);
    await user.click(screen.getByRole('menuitem', { name: /edit/i }));

    const input = screen.getByDisplayValue('/admin/');
    await user.clear(input);
    await user.keyboard('{Enter}');

    expect(screen.queryByRole('button', { name: '/admin/' })).not.toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('cancels an edit without saving', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ParamsList />);
    const moreButton = getRow('/admin/').querySelector('[aria-label="More actions"]') as HTMLElement;
    await user.click(moreButton);
    await user.click(screen.getByRole('menuitem', { name: /edit/i }));

    const input = screen.getByDisplayValue('/admin/');
    await user.clear(input);
    await user.type(input, '/changed/');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByRole('button', { name: '/admin/' })).toBeInTheDocument();
  });

  it('removes a param', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ParamsList />);
    const moreButton = getRow('/admin/').querySelector('[aria-label="More actions"]') as HTMLElement;
    await user.click(moreButton);
    await user.click(screen.getByRole('menuitem', { name: 'Remove' }));

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: '/admin/' })).not.toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: '/wp-admin/' })).toBeInTheDocument();
  });

  it('reorders params via drag and drop', async () => {
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });

    const { store } = renderWithProviders(<ParamsList />);
    const handle1 = screen.getByTitle('Shortcut key 1');
    const row2 = getRow('/wp-admin/');
    const dataTransfer = { effectAllowed: '', dropEffect: '', setData: vi.fn(), getData: vi.fn() };

    fireEvent.dragStart(handle1, { dataTransfer });
    fireEvent.dragOver(row2, { dataTransfer });
    fireEvent.drop(row2, { dataTransfer });

    await waitFor(() => {
      expect(store.getState().params.data.map((param) => param.id)).toEqual(['2', '1']);
    });

    vi.unstubAllGlobals();
  });

  it('clears the dragged/drag-over state on drag end without dropping', () => {
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });

    renderWithProviders(<ParamsList />);
    const handle1 = screen.getByTitle('Shortcut key 1');
    const row1 = getRow('/admin/');
    const dataTransfer = { effectAllowed: '', dropEffect: '', setData: vi.fn(), getData: vi.fn() };

    fireEvent.dragStart(handle1, { dataTransfer });
    expect(row1.className).toContain('opacity-50');

    fireEvent.dragEnd(handle1);
    expect(row1.className).not.toContain('opacity-50');

    vi.unstubAllGlobals();
  });

  it('shows and dismisses the keyboard-shortcut warning', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ParamsList />);

    await user.keyboard('9');
    const warning = await screen.findByText(/invalid key/i);

    await user.click(screen.getByRole('button', { name: 'Close warning' }));
    await waitFor(() => {
      expect(warning).not.toBeInTheDocument();
    });
  });

  describe('with groups', () => {
    const groups: Group[] = [
      { id: 'g1', name: 'Admin pages', items: ['1'], selected: true },
      { id: 'g2', name: 'Other', items: [], selected: false },
    ];

    it('shows the selected group name next to the heading', () => {
      renderWithProviders(<ParamsList />, {
        preloadedState: { ...initialState, groups: { data: groups } },
      });
      expect(screen.getByText('[Admin pages group]')).toBeInTheDocument();
    });

    it('filters params to the selected group', () => {
      renderWithProviders(<ParamsList />, {
        preloadedState: { ...initialState, groups: { data: groups } },
      });
      expect(screen.getByRole('button', { name: '/admin/' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: '/wp-admin/' })).not.toBeInTheDocument();
    });

    it('shows a "no params in group" message with a way back to all groups', async () => {
      const user = userEvent.setup();
      const emptyGroup: Group[] = [{ id: 'g1', name: 'Empty', items: [], selected: true }];
      const { store } = renderWithProviders(<ParamsList />, {
        preloadedState: { ...initialState, groups: { data: emptyGroup } },
      });

      expect(screen.getByTestId('no-params')).toHaveTextContent('No params in the selected group');
      await user.click(screen.getByRole('button', { name: /show all groups/i }));
      expect(store.getState().preferences.showGroups).toBe(true);
    });

    it('moves a param to a group from the dropdown menu', async () => {
      const user = userEvent.setup();
      const { store } = renderWithProviders(<ParamsList />, {
        preloadedState: { ...initialState, groups: { data: groups } },
      });

      const moreButton = getRow('/admin/').querySelector('[aria-label="More actions"]') as HTMLElement;
      await user.click(moreButton);
      await user.click(screen.getByText('Move to group'));
      const otherCheckbox = await screen.findByRole('menuitemcheckbox', { name: 'Other' });
      fireEvent.click(otherCheckbox);

      await waitFor(() => {
        expect(store.getState().groups.data.find((group) => group.id === 'g2')?.items).toContain('1');
      });
    });

    it('removes a param from the current group', async () => {
      const user = userEvent.setup();
      const { store } = renderWithProviders(<ParamsList />, {
        preloadedState: { ...initialState, groups: { data: groups } },
      });

      const moreButton = getRow('/admin/').querySelector('[aria-label="More actions"]') as HTMLElement;
      await user.click(moreButton);
      await user.click(screen.getByRole('menuitem', { name: /remove from this group/i }));

      await waitFor(() => {
        expect(store.getState().groups.data.find((group) => group.id === 'g1')?.items).not.toContain('1');
      });
    });
  });
});
