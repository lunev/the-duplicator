import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import Preferences from './components/Preferences';

const Settings: React.FC = () => {
  return (
    <>
      <Link to="/" className="mb-4 inline-flex gap-1 items-center underline hover:no-underline">
        <ArrowLeftIcon style={{ width: '12px', height: '12px' }} />
        Back to Dashboard
      </Link>
      <h2 className="uppercase opacity-50 text-xxs">Settings</h2>
      <Preferences />
    </>
  );
};

export default Settings;
