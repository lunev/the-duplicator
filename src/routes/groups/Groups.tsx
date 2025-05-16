import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { addGroup, removeGroup, updateGroup, activateGroup } from '@/features/groups/groups-slice';
import { showToast } from '@/utils/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Form from '@/components/ui/form/Form';
import * as DM from '@/components/ui/dropdown-menu';
import { Group } from '@/types';
import { nanoid } from 'nanoid';
import { ArrowLeftIcon, CheckIcon, Cross2Icon, DotsVerticalIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { GENERAL_GROUP } from '@/constants';
import styles from './Groups.module.css';

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
      showToast(<>The group has been renamed</>);
      setEditedGroup(null);
    }
  };

  const handleRemove = (group: Group) => {
    dispatch(removeGroup(group));
    dispatch(activateGroup({ groupId: GENERAL_GROUP }));
    showToast(
      <>
        The <strong>{group.name}</strong> group has been removed
      </>,
    );
  };

  return (
    <>
      <Link to="/" className={styles.buttonBack}>
        <ArrowLeftIcon style={{ width: '12px', height: '12px' }} />
        Back to Dashboard
      </Link>
      <h2 className={styles.subheading}>Groups</h2>
      {groups.length > 0 ? (
        groups.map((group) => (
          <div key={group.id} className={styles.groupItem}>
            {editedGroup?.id === group.id ? (
              <form onSubmit={handleSave} className={styles.form}>
                <Input
                  type="text"
                  value={editedGroup.name}
                  className={styles.input}
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
                <div className={styles.name}>{group.name}</div>
                <DM.DropdownMenu>
                  <DM.DropdownMenuTrigger>
                    <DotsVerticalIcon />
                  </DM.DropdownMenuTrigger>
                  <DM.DropdownMenuContent className={styles.dropdownMenuContent}>
                    <DM.DropdownMenuLabel>{group.name}</DM.DropdownMenuLabel>
                    <DM.DropdownMenuSeparator />
                    <DM.DropdownMenuItem onClick={() => handleEdit(group.id)}>
                      <Pencil1Icon /> Edit
                    </DM.DropdownMenuItem>
                    <DM.DropdownMenuItem onClick={() => handleRemove(group)}>
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
        className={styles.formAdd}
        label="Group name"
        placeholder="Enter a group name"
        button="Add"
        autofocus={addParam}
        onSubmit={(groupName) => {
          const newGroup: Group = { id: nanoid(), name: groupName, items: [], selected: groups.length === 0 };
          dispatch(addGroup(newGroup));
        }}
        toastMessage={(groupName) => (
          <>
            The new <strong>{groupName}</strong> group has been created
          </>
        )}
      />
    </>
  );
};

export default Groups;
