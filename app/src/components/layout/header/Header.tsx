import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { APP_NAME } from '@/constants';
import { DotsVerticalIcon, DownloadIcon, GearIcon, UploadIcon } from '@radix-ui/react-icons';
import { handleExport } from '@/utils/utils';
import { Button } from '@/components/ui/button';
import * as DM from '@/components/ui/dropdown-menu';
import logo from '@/assets/logo128x128.png';

const Header: React.FC = () => {
  const { data: params } = useAppSelector((state) => state.params);
  const preferences = useAppSelector((state) => state.preferences);
  const navigate = useNavigate();

  return (
    <header className="fade-in flex items-center gap-3 border-b bg-card px-4 py-3">
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <img src={logo} width="32" height="32" alt={`${APP_NAME} logo`} />
        <Link to="/" className="truncate text-base font-bold text-foreground">
          {APP_NAME}
        </Link>
        {preferences.basicMode && <span className="text-xxxs -translate-y-1 -translate-x-1">Basic Mode</span>}
      </div>
      <DM.DropdownMenu>
        <DM.DropdownMenuTrigger asChild>
          <Button size="icon" variant="round" aria-label="More actions" data-testid="dropdown-trigger">
            <DotsVerticalIcon className="size-4" />
          </Button>
        </DM.DropdownMenuTrigger>
        <DM.DropdownMenuContent className="mr-4 [&_svg]:w-[12px] [&_svg]:h-[12px]">
          <DM.DropdownMenuItem onClick={() => navigate('/import-params')}>
            <DownloadIcon /> Import Parameters
          </DM.DropdownMenuItem>
          {params?.length > 0 && (
            <DM.DropdownMenuItem onClick={() => handleExport(params)}>
              <UploadIcon /> Export Parameters
            </DM.DropdownMenuItem>
          )}
          <DM.DropdownMenuSeparator />
          <DM.DropdownMenuItem onClick={() => navigate('/settings')}>
            <GearIcon /> Settings
          </DM.DropdownMenuItem>
        </DM.DropdownMenuContent>
      </DM.DropdownMenu>
    </header>
  );
};

export default Header;
