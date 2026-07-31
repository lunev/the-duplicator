import { nanoid } from 'nanoid';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { addParam } from '@/features/params/params-slice';
import { addParamToGroup } from '@/features/groups/groups-slice';
import { Param } from '@/types';
import { createTab, updateTab } from '@/utils/utils';
import Form from '@/components/ui/form/Form';
import UpdateInfo from './components/updates/UpdateInfo';
import ParamsList from './components/params/Params';
import TabGroups from './components/tabgroups/TabGroups';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const { basicMode, showForm, showGroups } = useAppSelector((state) => state.preferences);
  const preferences = useAppSelector((state) => state.preferences);
  const { data: groups } = useAppSelector((state) => state.groups);
  const selectedGroup = groups.find((group) => group.selected);
  const dispatch = useAppDispatch();

  if (basicMode) {
    return (
      <Form
        label="Enter Url Parameter"
        placeholder="Enter a URL parameter"
        button="Go"
        onSubmit={(urlParam) => (preferences.newTab ? createTab(urlParam) : updateTab(urlParam))}
      />
    );
  }

  return (
    <div data-testid="dashboard">
      <UpdateInfo />
      {showGroups && <TabGroups />}
      <ParamsList />
      {(showForm === undefined || showForm) && ( // Show the form if 'showForm' is undefined (before redux-persist rehydrates state)
        <Form
          className={styles.form}
          label="New URL Parameter"
          placeholder="Enter a URL parameter"
          button="Add"
          onSubmit={(urlParam) => {
            const newParam: Param = { id: nanoid(), title: urlParam };
            dispatch(addParam(newParam));
            if (selectedGroup) {
              dispatch(addParamToGroup({ groupId: selectedGroup.id, paramId: newParam.id }));
            }
          }}
          toastMessage={(urlParam) => (
            <>
              New param <strong>{urlParam}</strong> has been added
            </>
          )}
        />
      )}
    </div>
  );
};

export default Dashboard;
