import { fireEvent, render, screen, waitFor } from '@test-utils';
import * as hooks from '@/app/hooks';
import * as slices from '@/features/params/params-slice';
import ButtonClear from './ButtonClear';

describe('ButtonClear Component', () => {
  it('clears all params', async () => {
    window.confirm = vi.fn(() => true);

    const mockDispatch = vi.fn();
    const dispatchSpy = vi
      .spyOn(hooks, 'useAppDispatch')
      .mockReturnValue(mockDispatch);
    const updateAllParamsSpy = vi.spyOn(slices, 'updateAllParams');

    render(<ButtonClear />);

    const clearButton = screen.getByRole('button', {
      name: 'Clear all params',
    });
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalled();
      expect(updateAllParamsSpy).toHaveBeenCalledWith([]);
    });
  });
});
