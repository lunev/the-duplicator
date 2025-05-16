import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mergeParams } from '@/utils/utils';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { updateAllParams } from '@/features/params/params-slice';
import { Cross2Icon } from '@radix-ui/react-icons';

const ImportedParams: React.FC = () => {
  const { data: params } = useAppSelector((state) => state.params);
  const [fileContent, setFileContent] = useState('');
  const [message, setMessage] = useState('');
  const dispatch = useAppDispatch();
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFileContent(reader.result as string);
      };
      reader.onerror = () => {
        setMessage('Error reading the file. Please try again.');
      };
      reader.readAsText(file);
    }
  };

  const handleImport = () => {
    try {
      const importedParams = JSON.parse(fileContent);
      const isValidFormat =
        Array.isArray(importedParams) &&
        importedParams.every((item) => {
          return (
            typeof item === 'object' &&
            Object.prototype.hasOwnProperty.call(item, 'id') &&
            Object.prototype.hasOwnProperty.call(item, 'title')
          );
        });
      if (isValidFormat) {
        const res = mergeParams(params, importedParams);
        dispatch(updateAllParams(res));
        setMessage('Params have been successfully imported');
      } else {
        setMessage('Failed to parse JSON');
      }
    } catch (error) {
      setMessage(`Failed to parse JSON: ${error}`);
    } finally {
      if (inputFileRef.current) {
        inputFileRef.current.value = '';
      }
      setFileContent('');
    }
  };

  return (
    <>
      <h2 className="mb-1 opacity-50 text-xxs">URL Parameters</h2>
      <div className="flex gap-2">
        <Input type="file" ref={inputFileRef} accept=".json" onChange={(e) => handleFileSelection(e)} />
        <Button onClick={handleImport} disabled={fileContent.length === 0}>
          Import
        </Button>
      </div>
      {message && (
        <div className={`mt-4 flex gap-2 rounded-md bg-green-200 ${message.includes('Failed') ? 'bg-red-200' : ''}`}>
          <div className="py-2 px-3 text-sm flex-1">{message}</div>
          <Button size="icon" variant="link" onClick={() => setMessage('')}>
            <Cross2Icon />
          </Button>
        </div>
      )}
    </>
  );
};

export default ImportedParams;
