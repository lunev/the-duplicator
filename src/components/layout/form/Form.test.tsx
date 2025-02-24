import { act, fireEvent, render, screen, waitFor } from '@test-utils';
import Form from './Form';
import { createTab, updateTab } from '@/utils/utils.ts';

beforeEach(() => {
  vi.mock('@/utils/utils', () => ({
    createTab: vi.fn(),
    updateTab: vi.fn(),
  }));
});

describe('Form Rendering', () => {
  it('renders the form with input and button elements', () => {
    render(<Form />);

    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: 'Add' });
    expect(submitButton).toBeInTheDocument();
  });
  it('renders the button with the correct label based on basicMode', () => {
    render(<Form basicMode />);

    const submitButton = screen.getByRole('button', { name: 'Go' });
    expect(submitButton).toBeInTheDocument();
  });
});

describe('Form Validation', () => {
  it('shows an error message when the input is empty and the form is submitted', async () => {
    render(<Form />);
    const button = screen.getByRole('button');
    const input = screen.getByRole('textbox');

    expect(input).toHaveValue('');

    act(() => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      const validationErrorMsg = screen.getByText(/this field is required/i);
      expect(validationErrorMsg).toBeInTheDocument();
    });
  });
  it('removes the error message after entering a valid input', async () => {
    render(<Form />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');
    expect(input).toHaveValue('');

    act(() => {
      fireEvent.click(button);
    });
    await waitFor(() => {
      const validationErrorMsg = screen.getByText(/this field is required/i);
      expect(validationErrorMsg).toBeInTheDocument();
    });

    act(() => {
      fireEvent.change(input, { target: { value: '/admin/' } });
    });

    await waitFor(() => {
      expect(input).toHaveValue('/admin/');
      expect(
        screen.queryByText(/this field is required/i),
      ).not.toBeInTheDocument();
    });
  });
  it('removes the error message when the input is blur', async () => {
    render(<Form />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');

    act(() => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(screen.queryByText('This field is required')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.blur(input);
    });

    await waitFor(() => {
      expect(
        screen.queryByText('This field is required'),
      ).not.toBeInTheDocument();
    });
  });
});

describe('Basic Mode Behavior', () => {
  it('calls createTab with the correct input when newTab is true', async () => {
    render(<Form basicMode />, {
      initialState: {
        preferences: { basicMode: true, newTab: true, sidePanel: false },
      },
    });

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');

    act(() => {
      fireEvent.change(input, { target: { value: '/admin/' } });
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(createTab).toHaveBeenCalledWith('/admin/');
    });
  });
  it('calls updateTab with the correct input when newTab is false', async () => {
    render(<Form basicMode />, {
      initialState: {
        preferences: { basicMode: true, newTab: false, sidePanel: false },
      },
    });

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');

    act(() => {
      fireEvent.change(input, { target: { value: '/admin/' } });
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(updateTab).toHaveBeenCalledWith('/admin/');
    });
  });
});

describe('Advanced Mode Behavior', () => {
  it('dispatches addParam with the correct data', () => {});
  it('resets the form after submission', async () => {
    render(<Form />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');

    act(() => {
      fireEvent.change(input, { target: { value: '/admin/' } });
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });
});
