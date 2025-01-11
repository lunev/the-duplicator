import { useAppDispatch } from '@/app/hooks';
import { updateAllParams } from '@/features/params/params-slice';

const ButtonClear: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleClear = () => {
    const confirmation = confirm('Do you want to remove all params?');
    if (confirmation) {
      dispatch(updateAllParams([]));
    }
  };

  return (
    <button
      className="btn-warning"
      onClick={handleClear}
      aria-label="Clear all params"
    >
      Clear All
    </button>
  );
};

export default ButtonClear;
