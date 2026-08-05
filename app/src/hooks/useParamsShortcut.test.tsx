import { renderHook } from '@testing-library/react';
import useParamsShortcut from './useParamsShortcut';
import { act } from 'react-dom/test-utils';
import type { Mock } from 'vitest';

describe('useParamsShortcut', () => {
  const params = [
    { id: '1', title: 'Tab 1' },
    { id: '2', title: 'Tab 2' },
  ];

  let handleOpenTab: Mock<(title: string) => void>;
  let setKeydownWarning: Mock<(value: boolean) => void>;

  beforeEach(() => {
    handleOpenTab = vi.fn<(title: string) => void>();
    setKeydownWarning = vi.fn<(value: boolean) => void>();
  });

  const fireKeyDown = (key: string, target?: HTMLElement) => {
    const event = new KeyboardEvent('keydown', { key, bubbles: true });
    Object.defineProperty(event, 'target', {
      value: target || document.body,
      configurable: true,
    });
    document.dispatchEvent(event);
  };

  it('calls handleOpenTab with correct param title for valid number keys', () => {
    renderHook(() => useParamsShortcut({ params, handleOpenTab, setKeydownWarning }));

    act(() => {
      fireKeyDown('1');
    });

    expect(handleOpenTab).toHaveBeenCalledWith('Tab 1');
    expect(setKeydownWarning).not.toHaveBeenCalled();
  });

  it('calls setKeydownWarning if number exceeds param list length', () => {
    renderHook(() => useParamsShortcut({ params, handleOpenTab, setKeydownWarning }));

    act(() => {
      fireKeyDown('9');
    });

    expect(handleOpenTab).not.toHaveBeenCalled();
    expect(setKeydownWarning).toHaveBeenCalledWith(true);
  });

  it('does not trigger if target is input or button', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);

    renderHook(() => useParamsShortcut({ params, handleOpenTab, setKeydownWarning }));

    act(() => {
      fireKeyDown('1', input);
    });

    expect(handleOpenTab).not.toHaveBeenCalled();
    expect(setKeydownWarning).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });

  it('does not respond to non-number keys', () => {
    renderHook(() => useParamsShortcut({ params, handleOpenTab, setKeydownWarning }));

    act(() => {
      fireKeyDown('a');
    });

    expect(handleOpenTab).not.toHaveBeenCalled();
    expect(setKeydownWarning).not.toHaveBeenCalled();
  });

  it('cleans up event listener on unmount', () => {
    const { unmount } = renderHook(() => useParamsShortcut({ params, handleOpenTab, setKeydownWarning }));

    unmount();

    act(() => {
      fireKeyDown('1');
    });

    expect(handleOpenTab).not.toHaveBeenCalled();
  });
});
