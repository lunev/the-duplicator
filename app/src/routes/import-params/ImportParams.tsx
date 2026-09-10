import { ChangeEvent, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Button } from '@/components/ui/button';
import { updateAllParams } from '@/features/params/params-slice';
import { isValidParamsPayload, mergeParams, showToast } from '@/utils/utils';

const ImportParams = () => {
  const { data: params } = useAppSelector((state) => state.params);
  const [fileName, setFileName] = useState('');
  const dispatch = useAppDispatch();
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleImport = (fileContent: string) => {
    try {
      const importedParams = JSON.parse(fileContent);
      if (isValidParamsPayload(importedParams)) {
        const res = mergeParams(params, importedParams);
        dispatch(updateAllParams(res));
        showToast('Params have been successfully imported');
      } else {
        showToast('Failed to parse JSON', 'destructive');
      }
    } catch (error) {
      showToast(`Failed to parse JSON: ${error}`, 'destructive');
    } finally {
      if (inputFileRef.current) {
        inputFileRef.current.value = '';
      }
    }
  };

  const handleFileSelection = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFileName(file.name);
        handleImport(reader.result as string);
      };
      reader.onerror = () => {
        showToast('Error reading the file. Please try again.', 'destructive');
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      <h2 className="mb-1 opacity-50 text-xxs uppercase">Import URL Parameters</h2>
      <div
        role="button"
        tabIndex={0}
        className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border p-4 text-center cursor-pointer"
        onClick={() => inputFileRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputFileRef.current?.click();
          }
        }}
      >
        <p className="text-sm text-muted-foreground">Select a JSON file to import</p>
        <Button size="sm">Select file</Button>
        <input
          type="file"
          ref={inputFileRef}
          accept=".json"
          className="hidden"
          onChange={(e) => handleFileSelection(e)}
        />
        {fileName && <p className="text-xs text-muted-foreground">{fileName}</p>}
      </div>
    </>
  );
};

export default ImportParams;
