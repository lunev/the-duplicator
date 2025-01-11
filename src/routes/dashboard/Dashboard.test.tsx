import { render, screen } from '@test-utils';
import Dashboard from './Dashboard';

describe('Dashboard component', () => {
  it('renders the dashboard component', () => {
    render(<Dashboard />);
    expect(
      screen.getByRole('heading', { name: /dashboard/i }),
    ).toBeInTheDocument();
  });

  it('does not render ParamsList when basicMode is true', () => {
    render(<Dashboard />, {
      initialState: {
        preferences: {
          basicMode: true,
          newTab: false,
        },
      },
    });
    expect(screen.queryByTestId('params')).not.toBeInTheDocument();
  });

  it('renders ParamsList when basicMode is false', () => {
    render(<Dashboard />, {
      initialState: {
        preferences: {
          basicMode: false,
          newTab: false,
        },
      },
    });
    expect(screen.queryByTestId('params')).toBeInTheDocument();
  });

  it('renders form', () => {
    render(<Dashboard />);
    expect(screen.queryByRole('form')).toBeInTheDocument();
  });
});
