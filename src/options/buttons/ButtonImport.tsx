import { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { updateAllParams } from '@/features/params/params-slice';
import { mergeParams } from '@/utils/utils';

const ButtonImport = () => {
  const [message, setMessage] = useState('');
  const { data: params } = useAppSelector((state) => state.params);
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          const importedParams = JSON.parse(event.target.result);
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
            setMessage('Params have been successfully imported.');
          } else {
            alert(
              'Invalid JSON format. Each item must have both "id" and "title". Please make sure the JSON matches the required structure.',
            );
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <p>{message}</p>
      <button className="btn-outlined" aria-label="Import" onClick={handleClick}>
        Import
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        aria-label="Import file"
        style={{ display: 'none' }}
        onChange={handleImport}
      />
    </>
  );
};

export default ButtonImport;
