import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import ImportParamsForm from './components/ImportParamsForm';

const ImportParams: React.FC = () => {
  return (
    <>
      <Link to="/" className="mb-4 inline-flex gap-1 items-center underline hover:no-underline">
        <ArrowLeftIcon style={{ width: '12px', height: '12px' }} />
        Back to Dashboard
      </Link>
      <h2 className="uppercase opacity-50 text-xxs">Import Params</h2>
      <ImportParamsForm />
    </>
  );
};

export default ImportParams;
