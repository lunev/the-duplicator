import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { activateGroup } from '@/features/groups/groups-slice';
import { setPreference } from '@/features/preferences/preferences-slice';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as DM from '@/components/ui/dropdown-menu';
import { ArchiveIcon, DotsVerticalIcon, EyeNoneIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { GENERAL_GROUP } from '@/constants';
import styles from './TabGroups.module.css';

const TabGroups: React.FC = () => {
  const { data: groups } = useAppSelector((state) => state.groups);
  const selectedGroupId = groups.find((group) => group.selected)?.id || GENERAL_GROUP;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <>
      <h2 className={styles.subheading}>Groups</h2>
      <div className={styles.tabsContainer}>
        <Tabs
          className={styles.tabs}
          value={selectedGroupId}
          onValueChange={(value) => dispatch(activateGroup({ groupId: value }))}
        >
          <TabsList className={styles.tabList}>
            <TabsTrigger className={styles.tabTrigger} key={GENERAL_GROUP} value={GENERAL_GROUP}>
              {GENERAL_GROUP}
            </TabsTrigger>
            {groups.map((group) => (
              <TabsTrigger key={group.id} className={styles.tabTrigger} value={group.id}>
                {group.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <DM.DropdownMenu>
          <DM.DropdownMenuTrigger>
            <DotsVerticalIcon />
          </DM.DropdownMenuTrigger>
          <DM.DropdownMenuContent className={styles.dropdownMenuContent}>
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
