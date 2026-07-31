import { useEffect, useMemo, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import useParamsShortcut from '@/hooks/useParamsShortcut';
import { removeParam, updateParam } from '@/features/params/params-slice';
import { setPreference } from '@/features/preferences/preferences-slice';
import { moveParamToGroup, removeParamFromGroup, removeParamFromAllGroups } from '@/features/groups/groups-slice';
import { Group, Param } from '@/types';
import { createTab, updateTab, showToast } from '@/utils/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import * as DM from '@/components/ui/dropdown-menu';
import WarningMessage from '@/components/ui/warning-message/WarningMessage';
import KeyTooltip from '../keytooltip/KeyTooltip';
import {
  CheckIcon,
  Cross2Icon,
  DotsVerticalIcon,
  LinkBreak1Icon,
  MoveIcon,
  Pencil1Icon,
  TrashIcon,
} from '@radix-ui/react-icons';
import { ArchiveIcon } from 'lucide-react';
import styles from './Params.module.css';

const ParamsList: React.FC = () => {
  const [editedParam, setEditedParam] = useState<Param | null>(null);
  const [keydownWarning, setKeydownWarning] = useState<boolean>(false);
  const { data: params } = useAppSelector((state) => state.params);
  const { data: groups } = useAppSelector((state) => state.groups);
  const { showGroups } = useAppSelector((state) => state.preferences);
  const preferences = useAppSelector((state) => state.preferences);
  const selectedGroup = groups.find((group) => group.selected);
  const filteredParams = useMemo(() => {
    return selectedGroup ? params.filter((param) => selectedGroup.items.includes(param.id)) : params;
  }, [selectedGroup, params]);
  const dispatch = useAppDispatch();

  const handleSave = () => {
    if (!editedParam?.title.trim()) return;
    if (editedParam) {
      const updatedParam: Param = { ...editedParam, title: editedParam.title };
      dispatch(updateParam(updatedParam));
      showToast(
        <>
          The param <strong>{editedParam.title}</strong> has been saved
        </>,
      );
    }
    setEditedParam(null);
  };

  const handleOpenTab = (paramURL: string) => (preferences.newTab ? createTab(paramURL) : updateTab(paramURL));

  const moveToGroup = (param: Param, group: Group) => {
    if (!group.items.includes(param.id)) {
      dispatch(moveParamToGroup({ paramId: param.id, groupId: group.id }));
      showToast(
        <>
          The param <strong>{param.title}</strong> has been moved to the group <strong>{group.name}</strong>
        </>,
      );
    }
  };

  const handleRemove = (param: Param) => {
    dispatch(removeParam(param));
    dispatch(removeParamFromAllGroups({ paramId: param.id }));
    showToast(
      <>
        The param <strong>{param.title}</strong> has been removed
      </>,
    );
  };

  const handleRemoveFromGroup = (param: Param, group: Group) => {
    dispatch(removeParamFromGroup({ paramId: param.id, groupId: group.id }));
    showToast(
      <>
        The param <strong>{param?.title}</strong> has been removed from the <strong>{group?.name}</strong> group
      </>,
    );
  };

  useParamsShortcut({
    params: filteredParams,
    handleOpenTab,
    setKeydownWarning,
  });

  useEffect(() => {
    // Show form if there are no params
    if (params.length === 0) {
      dispatch(setPreference({ property: 'showForm', value: true }));
    }
  }, [dispatch, params.length]);

  return (
    <div data-testid="params">
      {keydownWarning && (
        <WarningMessage
          text="Invalid key! Please press a number key (1-9) that maps to an available URL parameter."
          onClose={() => setKeydownWarning(false)}
        />
      )}
      <h2 className={styles.subheading}>
        <span className={styles.subheadingLabel}>Url Parameters</span>
        {selectedGroup && !showGroups && <span className={styles.subheadingGroup}>[{selectedGroup.name} group]</span>}
      </h2>
      {filteredParams?.length > 0 ? (
        <div className={`${filteredParams.length > 14 ? styles.paramsScrollContainer : ''}`}>
          <TooltipProvider>
            {filteredParams.map((param, index) => (
              <div key={param.id} className={styles.paramItem}>
                <KeyTooltip index={index} />
                <div className={styles.paramTitle}>
                  {editedParam?.id === param.id ? (
                    <Input
                      type="text"
                      className={`${!editedParam?.title.trim() ? styles.paramEditedFieldInvalid : styles.paramEditedField}`}
                      value={editedParam.title}
                      onChange={(e) => setEditedParam({ ...editedParam, title: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    />
                  ) : (
                    <Button
                      variant="link"
                      className={styles.paramLink}
                      onClick={() => handleOpenTab(param.title)}
                      title={param.title}
                    >
                      {param.title}
                    </Button>
                  )}
                </div>
                <div className={styles.paramActions}>
                  {editedParam?.id === param.id ? (
                    <>
                      <Button size="icon" variant="ghost" aria-label="Save" title="Save" onClick={handleSave}>
                        <CheckIcon />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Cancel"
                        title="Cancel"
                        onClick={() => setEditedParam(null)}
                      >
                        <Cross2Icon />
                      </Button>
                    </>
                  ) : (
                    <>
                      <DM.DropdownMenu>
                        <DM.DropdownMenuTrigger>
                          <DotsVerticalIcon />
                        </DM.DropdownMenuTrigger>
                        <DM.DropdownMenuContent className={styles.paramsDropdownContent}>
                          <DM.DropdownMenuLabel title={param.title} className={styles.paramDropdownHeding}>
                            {param.title}
                          </DM.DropdownMenuLabel>
                          <DM.DropdownMenuSeparator />
                          {groups?.length > 0 && (
                            <DM.DropdownMenuSub>
                              <DM.DropdownMenuSubTrigger>
                                <MoveIcon />
                                Move to group
                              </DM.DropdownMenuSubTrigger>
                              <DM.DropdownMenuPortal>
                                <DM.DropdownMenuSubContent>
                                  {groups.map((group) => (
                                    <DM.DropdownMenuCheckboxItem
                                      key={group.id}
                                      checked={group.items.includes(param.id)}
                                      onCheckedChange={() => moveToGroup(param, group)}
                                    >
                                      {group.name}
                                    </DM.DropdownMenuCheckboxItem>
                                  ))}
                                </DM.DropdownMenuSubContent>
                              </DM.DropdownMenuPortal>
                            </DM.DropdownMenuSub>
                          )}
                          {selectedGroup && selectedGroup.items.includes(param.id) && (
                            <DM.DropdownMenuItem onClick={() => handleRemoveFromGroup(param, selectedGroup)}>
                              <LinkBreak1Icon /> Remove from this group
                            </DM.DropdownMenuItem>
                          )}
                          {groups?.length > 0 && <DM.DropdownMenuSeparator />}
                          <DM.DropdownMenuItem onClick={() => setEditedParam(param)}>
                            <Pencil1Icon /> Edit
                          </DM.DropdownMenuItem>
                          <DM.DropdownMenuItem onClick={() => handleRemove(param)}>
                            <TrashIcon /> Remove
                          </DM.DropdownMenuItem>
                        </DM.DropdownMenuContent>
                      </DM.DropdownMenu>
                    </>
                  )}
                </div>
              </div>
            ))}
          </TooltipProvider>
        </div>
      ) : (
        <>
          <p data-testid="no-params">No params{selectedGroup && <> in the selected group</>}</p>
          {selectedGroup && !showGroups && (
            <Button
              variant="secondary"
              size="sm"
              className={styles.btnShowGroups}
              onClick={() => dispatch(setPreference({ property: 'showGroups', value: true }))}
            >
              <ArchiveIcon /> Show all groups
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default ParamsList;
