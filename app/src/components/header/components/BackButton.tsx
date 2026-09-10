import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { Link, useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';

const PAGE_TITLES: Record<string, string> = {
  [ROUTES.SETTINGS]: 'Settings',
  [ROUTES.IMPORT_PARAMS]: 'Import Parameters',
  [ROUTES.GROUPS]: 'Groups',
};

const BackButton = () => {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname];

  return (
    <>
      <Button size="icon" variant="round" className="-ml-2 shrink-0" aria-label="Back to dashboard" asChild>
        <Link to={ROUTES.HOME}>
          <ArrowLeftIcon className="size-4" />
        </Link>
      </Button>
      {title && <span className="truncate text-base font-bold text-foreground">{title}</span>}
    </>
  );
};

export default BackButton;
