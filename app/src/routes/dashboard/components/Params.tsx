import {
  ArchiveIcon,
  CheckIcon,
  CopyIcon,
  Cross2Icon,
  DotsVerticalIcon,
  LinkBreak1Icon,
  MoveIcon,
  Pencil1Icon,
  TrashIcon,
} from '@radix-ui/react-icons';
import { useEffect, useMemo, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Button } from '@/components/ui/button';
import * as DM from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import WarningMessage from '@/components/warning-message/WarningMessage';
import { moveParamToGroup, removeParamFromAllGroups, removeParamFromGroup } from '@/features/groups/groups-slice';
import { removeParam, updateAllParams, updateParam } from '@/features/params/params-slice';
import { setPreference } from '@/features/preferences/preferences-slice';
import useParamsShortcut from '@/hooks/useParamsShortcut';
import { cn } from '@/lib/utils';
import { Group, Param } from '@/types';
import { reorderParams } from '@/utils/reorderParams';
import { createTab, showToast, updateTab } from '@/utils/utils';

const handleCopy = async (param: Param) => {
  try {
    await navigator.clipboard.writeText(param.title);
    showToast('Copied to clipboard');
  } catch {
    showToast('Failed to copy to clipboard', 'destructive');
  }
};

const ParamsList = () => {
  const [editedParam, setEditedParam] = useState<Param | null>(null);
  const [keydownWarning, setKeydownWarning] = useState<boolean>(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
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
  };

  const handleRemoveFromGroup = (param: Param, group: Group) => {
    dispatch(removeParamFromGroup({ paramId: param.id, groupId: group.id }));
    showToast(
      <>
        The param <strong>{param?.title}</strong> has been removed from the <strong>{group?.name}</strong> group
      </>,
    );
  };

  const handleDragStart = (event: React.DragEvent<HTMLButtonElement>, paramId: string) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', paramId);
    // Defer past the browser's ghost-image capture so the dimmed row style
    // doesn't bleed into the drag snapshot.
    requestAnimationFrame(() => setDraggedId(paramId));
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>, paramId: string) => {
    event.preventDefault(); // required or onDrop never fires
    event.dataTransfer.dropEffect = 'move';
    if (draggedId && draggedId !== paramId) {
      setDragOverId((prev) => (prev === paramId ? prev : paramId));
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, paramId: string) => {
    event.preventDefault();
    setDragOverId(null);
    if (draggedId && draggedId !== paramId) {
      const reordered = reorderParams(
        params,
        filteredParams.map((param) => param.id),
        draggedId,
        paramId,
      );
      if (reordered !== params) dispatch(updateAllParams(reordered));
    }
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
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
      <h2 className="opacity-50 text-xxs">
        <span className="uppercase">Url Parameters</span>
        {selectedGroup && !showGroups && <span className="pl-1">[{selectedGroup.name} group]</span>}
      </h2>
      {filteredParams?.length > 0 ? (
        <div className={cn(filteredParams.length > 14 && 'max-h-87.5 overflow-y-auto')}>
          {filteredParams.map((param, index) => (
            <div
              key={param.id}
              className={cn(
                'group flex mt-1 gap-2 items-center rounded',
                draggedId === param.id && 'opacity-50',
                dragOverId === param.id && draggedId !== param.id && 'ring-1 ring-primary',
              )}
              onDragOver={(e) => handleDragOver(e, param.id)}
              onDrop={(e) => handleDrop(e, param.id)}
            >
              <button
                type="button"
                className={cn(
                  'min-w-5 h-5 flex items-center justify-center px-1 text-xxs text-center border rounded drop-shadow-xs',
                  editedParam?.id === param.id ? 'cursor-default' : 'cursor-grab active:cursor-grabbing',
                )}
                draggable={editedParam?.id !== param.id}
                onDragStart={(e) => handleDragStart(e, param.id)}
                onDragEnd={handleDragEnd}
                title={index < 9 ? `Shortcut key ${index + 1}` : undefined}
              >
                {index + 1}
              </button>
              <div className="flex-1">
                {editedParam?.id === param.id ? (
                  <Input
                    type="text"
                    className={cn('text-xs', !editedParam?.title.trim() && 'border-red-500')}
                    value={editedParam.title}
                    onChange={(e) => setEditedParam({ ...editedParam, title: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  />
                ) : (
                  <div className="flex items-center">
                    <div className="flex-1">
                      <Button
                        size="sm"
                        className="min-w-0 justify-start p-0 h-4.5 rounded-none truncate"
                        variant="link"
                        onClick={() => handleOpenTab(param.title)}
                        title={param.title}
                      >
                        {param.title}
                      </Button>
                    </div>
                    <Button
                      size="icon-xs"
                      variant="round"
                      className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                      aria-label="Copy"
                      title="Copy"
                      onClick={() => handleCopy(param)}
                    >
                      <CopyIcon />
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                {editedParam?.id === param.id ? (
                  <>
                    <Button size="icon-xs" variant="round" aria-label="Save" title="Save" onClick={handleSave}>
                      <CheckIcon />
                    </Button>
                    <Button
                      size="icon-xs"
                      variant="round"
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
                      <DM.DropdownMenuTrigger asChild>
                        <Button size="icon-xs" variant="round" aria-label="More actions">
                          <DotsVerticalIcon />
                        </Button>
                      </DM.DropdownMenuTrigger>
                      <DM.DropdownMenuContent className="mr-5 [&_svg]:w-3 [&_svg]:h-3">
                        <DM.DropdownMenuLabel
                          title={param.title}
                          className="max-w-40 text-ellipsis overflow-hidden text-nowrap"
                        >
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
                          <DM.DropdownMenuItem
                            variant="destructive"
                            onClick={() => handleRemoveFromGroup(param, selectedGroup)}
                          >
                            <LinkBreak1Icon /> Remove from this group
                          </DM.DropdownMenuItem>
                        )}
                        {groups?.length > 0 && <DM.DropdownMenuSeparator />}
                        <DM.DropdownMenuItem onClick={() => setEditedParam(param)}>
                          <Pencil1Icon /> Edit
                        </DM.DropdownMenuItem>
                        <DM.DropdownMenuItem variant="destructive" onClick={() => handleRemove(param)}>
                          <TrashIcon /> Remove
                        </DM.DropdownMenuItem>
                      </DM.DropdownMenuContent>
                    </DM.DropdownMenu>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <p data-testid="no-params">No params{selectedGroup && <> in the selected group</>}</p>
          {selectedGroup && !showGroups && (
            <Button
              variant="secondary"
              size="sm"
              className="mt-1 [&_svg]:w-3 [&_svg]:h-3"
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
