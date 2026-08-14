import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { addGroup, removeGroup, updateGroup, activateGroup } from '@/features/groups/groups-slice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Form from '@/components/ui/form/Form';
import * as DM from '@/components/ui/dropdown-menu';
import { Group } from '@/types';
import { nanoid } from 'nanoid';
import { CheckIcon, Cross2Icon, DotsVerticalIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { GENERAL_GROUP } from '@/constants';

const Groups: React.FC = () => {
  const [editedGroup, setEditedGroup] = useState<Group | null>(null);
  const { data: groups } = useAppSelector((state) => state.groups);
  const [searchParams] = useSearchParams();
  const addParam = searchParams.has('add');
  const dispatch = useAppDispatch();

  const handleEdit = (id: string) => {
    const editedGroup = groups.find((group) => group.id === id);
    if (editedGroup) {
      setEditedGroup(editedGroup);
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editedGroup) {
      const updatedGroup = { ...editedGroup, name: editedGroup.name };
      dispatch(updateGroup(updatedGroup));
      setEditedGroup(null);
    }
  };

  const handleRemove = (group: Group) => {
    dispatch(removeGroup(group));
    dispatch(activateGroup({ groupId: GENERAL_GROUP }));
  };

  return (
    <>
      {groups.length > 0 ? (
        groups.map((group) => (
          <div key={group.id} className="flex items-center gap-2 mb-1">
            {editedGroup?.id === group.id ? (
              <form onSubmit={handleSave} className="w-full flex items-center">
                <Input
                  type="text"
                  value={editedGroup.name}
                  className="mt-1 mr-2 text-xs flex-1"
                  placeholder="Enter a group name"
                  required
                  onChange={(e) => setEditedGroup({ ...editedGroup, name: e.target.value })}
                />
                <Button type="submit" size="icon" variant="ghost" aria-label="Save" title="Save">
                  <CheckIcon />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  aria-label="Cancel"
                  title="Cancel"
                  onClick={() => setEditedGroup(null)}
                >
                  <Cross2Icon />
                </Button>
              </form>
            ) : (
              <>
                <div className="flex-1">{group.name}</div>
                <DM.DropdownMenu>
                  <DM.DropdownMenuTrigger>
                    <DotsVerticalIcon />
                  </DM.DropdownMenuTrigger>
                  <DM.DropdownMenuContent className="mr-5 [&_svg]:w-[12px] [&_svg]:h-[12px]">
                    <DM.DropdownMenuLabel>{group.name}</DM.DropdownMenuLabel>
                    <DM.DropdownMenuSeparator />
                    <DM.DropdownMenuItem onClick={() => handleEdit(group.id)}>
                      <Pencil1Icon /> Edit
                    </DM.DropdownMenuItem>
                    <DM.DropdownMenuItem variant="destructive" onClick={() => handleRemove(group)}>
                      <TrashIcon /> Remove
                    </DM.DropdownMenuItem>
                  </DM.DropdownMenuContent>
                </DM.DropdownMenu>
              </>
            )}
          </div>
        ))
      ) : (
        <p>No groups</p>
      )}
      <Form
        className="mt-4"
        label="Group name"
        typingPlaceholders={['Work', 'Personal', 'Clients', 'Testing']}
        button="Add"
        autofocus={addParam}
        onSubmit={(groupName) => {
          const newGroup: Group = { id: nanoid(), name: groupName, items: [], selected: groups.length === 0 };
          dispatch(addGroup(newGroup));
        }}
      />
    </>
  );
};

export default Groups;
