import { ChatBubbleIcon, DotsVerticalIcon, DownloadIcon, GearIcon, UploadIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';

import { useAppSelector } from '@/app/hooks';
import { Button } from '@/components/ui/button';
import * as DM from '@/components/ui/dropdown-menu';
import { ROUTES, SUPPORT_URL } from '@/constants';
import { handleExport } from '@/utils/utils';

const Actions = () => {
  const { data: params } = useAppSelector((state) => state.params);

  return (
    <DM.DropdownMenu>
      <DM.DropdownMenuTrigger asChild>
        <Button size="icon" variant="round" aria-label="More actions" data-testid="dropdown-trigger">
          <DotsVerticalIcon className="size-4" />
        </Button>
      </DM.DropdownMenuTrigger>
      <DM.DropdownMenuContent className="mr-4 [&_svg]:w-3 [&_svg]:h-3">
        <DM.DropdownMenuItem asChild>
          <Link to={ROUTES.IMPORT_PARAMS}>
            <DownloadIcon /> Import Parameters
          </Link>
        </DM.DropdownMenuItem>
        {params.length > 0 && (
          <DM.DropdownMenuItem onClick={() => handleExport(params)}>
            <UploadIcon /> Export Parameters
          </DM.DropdownMenuItem>
        )}
        <DM.DropdownMenuSeparator />
        <DM.DropdownMenuItem asChild>
          <Link to={ROUTES.SETTINGS}>
            <GearIcon /> Settings
          </Link>
        </DM.DropdownMenuItem>
        <DM.DropdownMenuItem asChild>
          <a href={SUPPORT_URL} target="_blank" rel="noreferrer noopener">
            <ChatBubbleIcon /> Support
          </a>
        </DM.DropdownMenuItem>
      </DM.DropdownMenuContent>
    </DM.DropdownMenu>
  );
};

export default Actions;
