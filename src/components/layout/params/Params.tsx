import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { removeParam, updateParam } from '@/features/params/params-slice';
import { Param } from '@/types';
import EditIcon from '@/components/ui/icons/EditIcon';
import TrashIcon from '@/components/ui/icons/TrashIcon';
import SaveIcon from '@/components/ui/icons/SaveIcon';
import XmarkIcon from '@/components/ui/icons/XmarkIcon';
import { createTab, updateTab } from '@/utils/utils';

type ParamsListTypes = {
  clickable?: boolean;
  limitHeight?: boolean;
};

const ParamsList: React.FC<ParamsListTypes> = ({
  clickable = true,
  limitHeight,
}) => {
  const { data: params } = useAppSelector((state) => state.params);
  const preferences = useAppSelector((state) => state.preferences);
  const dispatch = useAppDispatch();

  const [editedParam, setEditedParam] = useState<Param | null>();
  const [editedTitle, setEditedTitle] = useState<string>('');
  const [keydownWarning, setKeydownWarning] = useState<boolean>(false);

  const handleEditmode = (param: Param) => {
    setEditedParam(param);
    setEditedTitle(param.title);
  };

  const handleSave = () => {
    if (editedParam) {
      const updatedParam = { ...editedParam, title: editedTitle };
      dispatch(updateParam(updatedParam));
    }
    setEditedParam(null);
  };

  const handleOpenTab = (paramTitle: string) => {
    if (!clickable) return;
    return preferences.newTab ? createTab(paramTitle) : updateTab(paramTitle);
  };

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (
        !params ||
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLButtonElement
      )
        return;
      const keyNumber = parseInt(event.key);
      if (!isNaN(keyNumber) && keyNumber >= 1 && keyNumber <= 9) {
        const index = keyNumber - 1;
        if (index < params.length) {
          handleOpenTab(params[index].title);
        } else {
          setKeydownWarning(true);
        }
      }
    };
    if (clickable) {
      document.addEventListener('keydown', handleGlobalKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  });

  return (
    <div
      data-testid="params"
      className={`${limitHeight ? 'max-h-80 overflow-auto' : ''}`}
    >
      {params && params.length > 0 ? (
        <div className="mb-4">
          {keydownWarning && clickable && (
            <div className="relative">
              <p className="mb-3 text-xs text-orange-500 pr-8">
                Invalid key! Please press a number key (1-9) that maps to an
                available parameter.
              </p>
              <button
                className="btn-icon text-lg w-6 h-6 absolute right-0 top-0 flex items-center justify-center"
                aria-label="Close warning"
                onClick={() => setKeydownWarning(false)}
              >
                &times;
              </button>
            </div>
          )}
          {params.map((param, index) => (
            <div
              key={param.id}
              className="flex gap-2 mb-0.5 items-center hover:opacity-70 transition-all"
            >
              <div className="min-w-6 px-1 text-xxs text-center border border-sky-500 text-sky-500 rounded">
                {index + 1}
              </div>

              {editedParam && editedParam?.id === param.id ? (
                <input
                  type="text"
                  className="form-control flex-1"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                />
              ) : (
                <button
                  className={`flex-1 text-sky-600 text-left dark:text-sky-500 ${clickable ? 'cursor-pointer' : 'cursor-default'}`}
                  onClick={() => handleOpenTab(param.title)}
                >
                  {param.title}
                </button>
              )}

              <div className="flex">
                {editedParam && editedParam?.id === param.id ? (
                  <>
                    <button
                      className="btn-icon"
                      aria-label="Save"
                      title="Save"
                      onClick={handleSave}
                    >
                      <SaveIcon />
                    </button>
                    <button
                      className="btn-icon"
                      aria-label="Cancel"
                      title="Cancel"
                      onClick={() => setEditedParam(null)}
                    >
                      <XmarkIcon />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn-icon"
                      aria-label="Edit"
                      title="Edit"
                      onClick={() => handleEditmode(param)}
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="btn-icon"
                      aria-label="Remove"
                      title="Remove"
                      onClick={() => dispatch(removeParam(param))}
                    >
                      <TrashIcon />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="sr-only" data-testid="no-params">
          No params.
        </p>
      )}
    </div>
  );
};

export default ParamsList;
