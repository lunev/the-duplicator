import { useLocation } from 'react-router-dom';

import { ROUTES } from '@/constants';

import Actions from './components/Actions';
import BackButton from './components/BackButton';
import Brand from './components/Brand';

const Header = () => {
  const { pathname } = useLocation();
  const isRoot = pathname === ROUTES.HOME;

  return (
    <header className="fade-in flex items-center gap-3 border-b bg-card px-4 py-3">
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        {isRoot ? <Brand /> : <BackButton />}
      </div>
      <Actions />
    </header>
  );
};

export default Header;
