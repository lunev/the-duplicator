import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import Form from '@/components/layout/form/Form';
import ParamsList from '@/components/layout/params/Params';
import UpdateInfo from '@/components/layout/updates/UpdateInfo';
import { migrate } from '@/utils/migrateV4ToV5';

const Dashboard: React.FC = () => {
  const { basicMode } = useAppSelector((state) => state.preferences);
  const showParams = !basicMode;
  const dispatch = useAppDispatch();

  useEffect(() => {
    migrate(dispatch);
  });

  return (
    <div data-testid="dashboard">
      <h1 className="sr-only">Dashboard</h1>
      <UpdateInfo />
      {showParams && <ParamsList limitHeight={true} />}
      <Form basicMode={basicMode} />
    </div>
  );
};

export default Dashboard;
