import { render, screen, fireEvent } from '@testing-library/react';
import ButtonExport from './ButtonExport';
import { Param } from '@/types';

describe('ButtonExport component', () => {
  const mockData: Param[] = [
    { id: '1', title: '/admin' },
    { id: '2', title: '/wp-admin/' },
  ];

  beforeEach(() => {
    // Mocking URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:url');
    global.URL.revokeObjectURL = vi.fn();
  });

  it('renders the export button', () => {
    render(<ButtonExport data={mockData} />);
    const buttonElement = screen.getByRole('button', {
      name: /export params/i,
    });
    expect(buttonElement).toBeInTheDocument();
  });

  it('triggers file export when button is clicked', () => {
    render(<ButtonExport data={mockData} />);
    const buttonElement = screen.getByRole('button', {
      name: /export params/i,
    });

    fireEvent.click(buttonElement);

    expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(global.URL.revokeObjectURL).toHaveBeenCalledTimes(1);
  });
});
