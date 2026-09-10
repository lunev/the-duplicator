import { nanoid } from 'nanoid';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import Form from '@/components/form/Form';
import { addParamToGroup } from '@/features/groups/groups-slice';
import { addParam } from '@/features/params/params-slice';
import { Param } from '@/types';
import { createTab, updateTab } from '@/utils/utils';

import ParamsList from './components/Params';
import TabGroups from './components/TabGroups';

const Dashboard = () => {
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
        typingPlaceholders={['/admin', '?ref=partner', '/en-US', '?debug=true']}
        button="Go"
        onSubmit={(urlParam) => (preferences.newTab ? createTab(urlParam) : updateTab(urlParam))}
      />
    );
  }

  return (
    <div data-testid="dashboard">
      {showGroups && <TabGroups />}
      <ParamsList />
      {(showForm === undefined || showForm) && ( // Show the form if 'showForm' is undefined (before redux-persist rehydrates state)
        <Form
          className="mt-4"
          label="New URL Parameter"
          typingPlaceholders={['/admin', '?ref=partner', '/en-US', '?debug=true']}
          button="Add"
          onSubmit={(urlParam) => {
            const newParam: Param = { id: nanoid(), title: urlParam };
            dispatch(addParam(newParam));
            if (selectedGroup) {
              dispatch(addParamToGroup({ groupId: selectedGroup.id, paramId: newParam.id }));
            }
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
