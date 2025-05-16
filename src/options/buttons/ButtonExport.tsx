import { Param } from '@/types';

type ButtonExportTypes = {
  data: Param[];
};

const ButtonExport: React.FC<ButtonExportTypes> = ({ data }) => {
  const handleExport = () => {
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const filename = `the_duplicator_parameters.json`;
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <button
        className="btn-outlined"
        onClick={handleExport}
        aria-label="Export params"
      >
        Export
      </button>
    </>
  );
};

export default ButtonExport;
