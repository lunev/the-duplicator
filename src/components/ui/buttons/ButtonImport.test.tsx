import { fireEvent, render, screen, waitFor } from '@test-utils';
import ButtonImport from './ButtonImport';
import * as hooks from '@/app/hooks';
import * as slices from '@/features/params/params-slice';

describe('ButtonImport component', () => {
  it('should render the import button', () => {
    render(<ButtonImport />);
    expect(screen.getByRole('button', { name: /import/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/import file/i)).toBeInTheDocument();
  });

  it('should trigger file input when the import button is clicked', () => {
    render(<ButtonImport />);
    const button = screen.getByRole('button', { name: /import/i });
    const fileInput = screen.getByLabelText(/import file/i);

    const clickSpy = vi.spyOn(fileInput, 'click');

    fireEvent.click(button);

    expect(clickSpy).toHaveBeenCalled();
  });

  it('should parse and import valid JSON', async () => {
    const validParams = [
      { id: '1', title: '/admin/' },
      { id: '2', title: '/wp-admin/' },
    ];
    const file = new Blob([JSON.stringify(validParams)], {
      type: 'application/json',
    });
    const reader = {
      onload: vi.fn(),
      onerror: vi.fn(),
      readAsText: vi.fn(),
      result: null,
    };
    global.FileReader = vi.fn(() => reader) as unknown as typeof FileReader;

    const mockDispatch = vi.fn();
    const dispatchSpy = vi
      .spyOn(hooks, 'useAppDispatch')
      .mockReturnValue(mockDispatch);
    const updateAllParamsSpy = vi.spyOn(slices, 'updateAllParams');

    render(<ButtonImport />);

    const button = screen.getByRole('button', { name: /import/i });
    const fileInput = screen.getByLabelText(/import file/i);

    fireEvent.click(button);
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(reader.readAsText).toHaveBeenCalled();
      reader.onload({ target: { result: JSON.stringify(validParams) } });
      expect(dispatchSpy).toHaveBeenCalled();
      expect(updateAllParamsSpy).toHaveBeenCalledWith(validParams);
    });
  });

  it('should alert when is invalid JSON', async () => {
    const inValidParams = [{ title: '/admin/' }, { id: '2' }];
    const file = new Blob([JSON.stringify(inValidParams)], {
      type: 'application/json',
    });
    const reader = {
      onload: vi.fn(),
      onerror: vi.fn(),
      readAsText: vi.fn(),
      result: null,
    };
    global.FileReader = vi.fn(() => reader) as unknown as typeof FileReader;

    const alertSpy = vi.spyOn(window, 'alert');

    render(<ButtonImport />);

    const button = screen.getByRole('button', { name: /import/i });
    const fileInput = screen.getByLabelText(/import file/i);

    fireEvent.click(button);
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(reader.readAsText).toHaveBeenCalled();
      reader.onload({ target: { result: JSON.stringify(inValidParams) } });
      expect(alertSpy).toHaveBeenCalledWith(
        'Invalid JSON format. Each item must have both "id" and "title". Please make sure the JSON matches the required structure.',
      );
    });
  });
});
