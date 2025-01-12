import { screen, render, fireEvent, act, waitFor } from '@test-utils';
import Header from './Header';
import { APP_NAME } from '@/constants';
import * as router from 'react-router-dom';
import type { Location } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof router>('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
  };
});

describe('Header Component', () => {
  const setupMocks = (pathname: string) => {
    const navigateMock = vi.fn();
    vi.mocked(router.useNavigate).mockReturnValue(navigateMock);

    const mockLocation: Location = {
      pathname,
      search: '',
      hash: '',
      state: null,
      key: 'mock-key',
    };
    vi.mocked(router.useLocation).mockReturnValue(mockLocation);

    return navigateMock;
  };

  it('should render the header component', () => {
    render(<Header />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('should display the app logo', () => {
    render(<Header />);
    expect(
      screen.getByRole('img', { name: `${APP_NAME} logo` }),
    ).toBeInTheDocument();
  });

  it('should display the app name as a link to the home page', () => {
    render(<Header />);
    const link = screen.getByRole('link', { name: `${APP_NAME}` });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('should display "Basic Mode" badge when preferences.basicMode is true', () => {
    render(<Header />, {
      route: '/',
      initialState: {
        preferences: { basicMode: true, newTab: false },
      },
    });
    expect(screen.getByText('Basic Mode')).toBeInTheDocument();
  });

  it('should navigate to /preferences when not on the /preferences path', async () => {
    const navigateMock = setupMocks('/');

    render(<Header />);
    const preferencesButton = screen.getByRole('button', {
      name: /preferences/i,
    });
    expect(preferencesButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(preferencesButton);
    });

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/preferences');
    });
  });

  it('should navigate to / when not on the /preferences path', async () => {
    const navigateMock = setupMocks('/preferences');

    render(<Header />);
    const preferencesButton = screen.getByRole('button', {
      name: /preferences/i,
    });
    expect(preferencesButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(preferencesButton);
    });

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/');
    });
  });
});
