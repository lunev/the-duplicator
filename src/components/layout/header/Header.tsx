import { Link } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { APP_NAME } from '@/constants';
import { DotsVerticalIcon, DownloadIcon, RocketIcon, UploadIcon } from '@radix-ui/react-icons';
import { handleExport } from '@/utils/utils';
import * as DM from '@/components/ui/dropdown-menu';
import TogglePreferences from './components/TogglePreferences';
import logo from '@/assets/logo128x128.png';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const { data: params } = useAppSelector((state) => state.params);
  const preferences = useAppSelector((state) => state.preferences);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} width="32" height="32" alt={`${APP_NAME} logo`} />
        <Link to="/" className={styles.logoTitle}>
          {APP_NAME}
        </Link>
        {preferences.basicMode && <span className={styles.logoBadge}>Basic Mode</span>}
      </div>
      <TogglePreferences />
      <DM.DropdownMenu>
        <DM.DropdownMenuTrigger data-testid="dropdown-trigger">
          <DotsVerticalIcon />
        </DM.DropdownMenuTrigger>
        <DM.DropdownMenuContent className={styles.dropdown}>
          <DM.DropdownMenuItem onClick={() => chrome.runtime.openOptionsPage()}>
            <DownloadIcon /> Import Parameters
          </DM.DropdownMenuItem>
          {params?.length > 0 && (
            <DM.DropdownMenuItem onClick={() => handleExport(params)}>
              <UploadIcon /> Export Parameters
            </DM.DropdownMenuItem>
          )}
          <DM.DropdownMenuItem onClick={() => chrome.tabs.create({ url: 'https://www.patreon.com/c/lunevdev' })}>
            <RocketIcon /> Support the extension
          </DM.DropdownMenuItem>
        </DM.DropdownMenuContent>
      </DM.DropdownMenu>
    </header>
  );
};

export default Header;
