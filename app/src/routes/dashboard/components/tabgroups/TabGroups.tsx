import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { activateGroup } from '@/features/groups/groups-slice';
import { setPreference } from '@/features/preferences/preferences-slice';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as DM from '@/components/ui/dropdown-menu';
import { ArchiveIcon, DotsVerticalIcon, EyeNoneIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { GENERAL_GROUP } from '@/constants';

const TabGroups: React.FC = () => {
  const { data: groups } = useAppSelector((state) => state.groups);
  const selectedGroupId = groups.find((group) => group.selected)?.id || GENERAL_GROUP;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <>
      <h2 className="mb-1 uppercase opacity-50 text-xxs">Groups</h2>
      <div className="mb-4 flex gap-2 items-center">
        <Tabs
          className="flex-1"
          value={selectedGroupId}
          onValueChange={(value) => dispatch(activateGroup({ groupId: value }))}
        >
          <TabsList className="w-full">
            <TabsTrigger className="flex-1 text-xs" key={GENERAL_GROUP} value={GENERAL_GROUP}>
              {GENERAL_GROUP}
            </TabsTrigger>
            {groups.map((group) => (
              <TabsTrigger key={group.id} className="flex-1 text-xs" value={group.id}>
                {group.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <DM.DropdownMenu>
          <DM.DropdownMenuTrigger>
            <DotsVerticalIcon />
          </DM.DropdownMenuTrigger>
          <DM.DropdownMenuContent className="mr-5 [&_svg]:w-[12px] [&_svg]:h-[12px]">
            <DM.DropdownMenuLabel>Groups</DM.DropdownMenuLabel>
            <DM.DropdownMenuSeparator />
            <DM.DropdownMenuItem onClick={() => navigate('/groups')}>
              <ArchiveIcon /> Manage
            </DM.DropdownMenuItem>
            <DM.DropdownMenuItem onClick={() => navigate('/groups?add')}>
              <PlusCircledIcon /> Add
            </DM.DropdownMenuItem>
            <DM.DropdownMenuItem onClick={() => dispatch(setPreference({ property: 'showGroups', value: false }))}>
              <EyeNoneIcon /> Hide
            </DM.DropdownMenuItem>
          </DM.DropdownMenuContent>
        </DM.DropdownMenu>
      </div>
    </>
  );
};

export default TabGroups;
