import { act, fireEvent, render, screen, waitFor } from '@test-utils';
import Params from './Params';
import { createTab, updateTab } from '@/utils/utils.ts';

beforeEach(() => {
  vi.mock('@/utils/utils', () => ({
    createTab: vi.fn(),
    updateTab: vi.fn(),
  }));
});

describe('ParamsList Component', () => {
  describe('Rendering', () => {
    it('should display a message if no params are present', () => {
      render(<Params />, {
        initialState: {
          params: {
            data: [],
          },
        },
      });
      const noParamsMessage = screen.queryByText(/no params/i);
      expect(noParamsMessage).toBeInTheDocument();
    });

    it('should display params list if params are present', () => {
      render(<Params />);
      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      expect(removeButtons).toHaveLength(2);
    });
  });

  describe('Interactions', () => {
    it('should trigger edit mode when edit button is clicked', async () => {
      render(<Params />);
      const editButton = screen.getAllByRole('button', {
        name: /edit/i,
      })[0];
      expect(editButton).toBeInTheDocument();

      act(() => {
        fireEvent.click(editButton);
      });

      await waitFor(() => {
        const inputEdit = screen.getByRole('textbox');
        expect(inputEdit).toBeInTheDocument();
      });
    });

    it('should update param title when save button is clicked', async () => {
      render(<Params />);

      const editButton = screen.getAllByRole('button', {
        name: /edit/i,
      })[0];
      expect(editButton).toBeInTheDocument();

      act(() => {
        fireEvent.click(editButton);
      });

      await waitFor(() => {
        const inputEdit = screen.getByRole('textbox');
        expect(inputEdit).toBeInTheDocument();
      });

      const inputEdit = screen.getByRole('textbox');
      act(() => {
        fireEvent.change(inputEdit, { target: { value: 'New value' } });
      });

      const saveButton = screen.getByRole('button', {
        name: /save/i,
      });
      expect(saveButton).toBeInTheDocument();
      act(() => {
        fireEvent.click(saveButton);
      });

      await waitFor(() => {
        const newParam = screen.getByText('New value');
        expect(newParam).toBeInTheDocument();
      });
    });

    it('should prevent opening tabs on keypress when focus is on an input element', async () => {
      render(<Params />);

      const editButton = screen.getAllByRole('button', {
        name: /edit/i,
      })[0];
      expect(editButton).toBeInTheDocument();

      act(() => {
        fireEvent.click(editButton);
      });

      await waitFor(() => {
        const inputEdit = screen.getByRole('textbox');
        expect(inputEdit).toBeInTheDocument();
      });

      const inputEdit = screen.getByRole('textbox');
      inputEdit.focus();
      fireEvent.keyDown(inputEdit, { key: '1' });
      [createTab, updateTab].forEach((mockFn) => {
        expect(mockFn).toHaveBeenCalledTimes(0);
      });
    });

    it('should save the value when Enter is pressed', async () => {
      render(<Params />);

      const editButton = screen.getAllByRole('button', {
        name: /edit/i,
      })[0];
      expect(editButton).toBeInTheDocument();

      act(() => {
        fireEvent.click(editButton);
      });

      await waitFor(() => {
        const inputEdit = screen.getByRole('textbox');
        expect(inputEdit).toBeInTheDocument();
        fireEvent.change(inputEdit, { target: { value: 'New value' } });
      });

      const inputEdit = screen.getByRole('textbox');
      inputEdit.focus();
      fireEvent.keyDown(inputEdit, { key: 'Enter' });
      expect(screen.getByText('New value')).toBeInTheDocument();
    });

    it('should cancel edit mode when cance button is clicked', async () => {
      render(<Params />);

      const editButton = screen.getAllByRole('button', {
        name: /edit/i,
      })[0];
      expect(editButton).toBeInTheDocument();

      act(() => {
        fireEvent.click(editButton);
      });

      await waitFor(() => {
        const inputEdit = screen.getByRole('textbox');
        expect(inputEdit).toBeInTheDocument();
        expect(inputEdit).toHaveValue('/admin/');
      });

      const cancelButton = screen.getByRole('button', {
        name: /cancel/i,
      });
      expect(cancelButton).toBeInTheDocument();
      act(() => {
        fireEvent.click(cancelButton);
      });

      await waitFor(() => {
        const inputEdit = screen.queryByRole('textbox');
        expect(inputEdit).not.toBeInTheDocument();
      });
    });

    it('should remove a param when remove button is clicked', async () => {
      render(<Params />);
      const removeButton = screen.getAllByRole('button', {
        name: /remove/i,
      })[0];
      expect(removeButton).toBeInTheDocument();

      act(() => {
        fireEvent.click(removeButton);
      });

      await waitFor(() => {
        expect(screen.queryByText('/admin/')).not.toBeInTheDocument();
      });
    });

    it('should handle open params correctly in new tabs', async () => {
      render(<Params />, {
        initialState: {
          preferences: { basicMode: false, newTab: true, sidePanel: false },
        },
      });

      const paramButton = screen.getByRole('button', { name: '/admin/' });
      expect(paramButton).toBeInTheDocument();

      act(() => {
        fireEvent.click(paramButton);
      });

      await waitFor(() => {
        expect(createTab).toHaveBeenCalled();
      });
    });

    it('should handle open params correctly in current tabs', async () => {
      render(<Params />, {
        initialState: {
          preferences: { basicMode: false, newTab: false, sidePanel: false },
        },
      });

      const paramButton = screen.getByRole('button', { name: '/admin/' });
      expect(paramButton).toBeInTheDocument();

      act(() => {
        fireEvent.click(paramButton);
      });

      await waitFor(() => {
        expect(updateTab).toHaveBeenCalled();
      });
    });

    it('should open the correct tab when a valid key is pressed', () => {
      render(<Params />, {
        initialState: {
          preferences: { basicMode: false, newTab: true, sidePanel: false },
        },
      });
      fireEvent.keyDown(document, { key: '1' });
      expect(createTab).toHaveBeenCalled();
    });

    it('should ignore opening tab when params list is empty', async () => {
      render(<Params />, {
        initialState: {
          params: {
            data: [],
          },
        },
      });
      fireEvent.keyDown(document, { key: '1' });
      [createTab, updateTab].forEach((mockFn) => {
        expect(mockFn).toHaveBeenCalledTimes(0);
      });
    });

    it('should display a warning for invalid keydown inputs', async () => {
      render(<Params />, {
        initialState: {
          preferences: { basicMode: false, newTab: true, sidePanel: false },
        },
      });
      fireEvent.keyDown(document, { key: '3' });
      expect(createTab).not.toHaveBeenCalled();
      expect(screen.getByText(/invalid key/i)).toBeInTheDocument();

      const closeWarningButton = screen.getByRole('button', {
        name: /close warning/i,
      });
      expect(closeWarningButton).toBeInTheDocument();

      act(() => {
        fireEvent.click(closeWarningButton);
      });

      await waitFor(() => {
        expect(screen.queryByText(/invalid key/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Props', () => {
    it('should not open tabs if clickable prop is false', async () => {
      render(<Params clickable={false} />, {
        initialState: {
          preferences: { basicMode: false, newTab: true, sidePanel: false },
        },
      });

      const paramButton = screen.getByRole('button', { name: '/admin/' });
      expect(paramButton).toBeInTheDocument();

      act(() => {
        fireEvent.click(paramButton);
      });

      await waitFor(() => {
        expect(createTab).not.toHaveBeenCalled();
        expect(updateTab).not.toHaveBeenCalled();
      });
    });

    it('should limit height if limitHeight prop is true', () => {
      render(<Params limitHeight />);
      const paramsElement = screen.getByTestId('params');
      expect(paramsElement).toBeInTheDocument();
    });
  });
});
