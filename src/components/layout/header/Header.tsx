import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { APP_NAME } from '@/constants';
import logo from '@/assets/logo.png';
import SettingsIcon from '@/components/ui/icons/SettingsIcon';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const preferences = useAppSelector((state) => state.preferences);
  const location = useLocation();
  const navigate = useNavigate();

  const handleTogglePreferences = () => {
    const targetPath =
      location?.pathname === '/preferences' ? '/' : '/preferences';
    navigate(targetPath);
  };

  return (
    <header className={styles.header} data-testid="header">
      <div className={styles.logo}>
        <img src={logo} width="20" height="20" alt={`${APP_NAME} logo`} />
        <Link to="/" className={styles.headline}>
          {APP_NAME}
        </Link>
        {preferences.basicMode && (
          <span className={styles.badge}>Basic Mode</span>
        )}
      </div>
      <button
        className="btn-icon"
        data-testid="preferences"
        title="Preferences"
        aria-label="Preferences"
        onClick={handleTogglePreferences}
      >
        <SettingsIcon />
      </button>
    </header>
  );
};

export default Header;
