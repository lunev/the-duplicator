import { Link } from 'react-router-dom';

import { useAppSelector } from '@/app/hooks';
import logo from '@/assets/logo.svg';
import { APP_NAME, APP_SHORT_NAME, ROUTES } from '@/constants';

const Brand = () => {
  const basicMode = useAppSelector((state) => state.preferences.basicMode);

  return (
    <>
      <img src={logo} width="32" height="32" alt={`${APP_NAME} logo`} />
      <Link to={ROUTES.HOME} className="truncate text-base font-bold text-foreground">
        {APP_SHORT_NAME}
      </Link>
      {basicMode && <span className="text-xxxs -translate-y-1 -translate-x-1">Basic Mode</span>}
    </>
  );
};

export default Brand;
