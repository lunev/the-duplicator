import { useForm, SubmitHandler } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { addParam } from '@/features/params/params-slice';
import { Param } from '@/types';
import { createTab, updateTab } from '@/utils/utils';
import { v4 as uuidv4 } from 'uuid';

export type FormProps = {
  basicMode?: boolean;
};

const Form: React.FC<FormProps> = ({ basicMode }) => {
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state) => state.preferences);

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<Param>();

  const onSubmit: SubmitHandler<Param> = (data) => {
    if (basicMode) {
      const handler = preferences.newTab ? createTab : updateTab;
      handler(data.title);
    } else {
      const newParam = { ...data, id: uuidv4() };
      dispatch(addParam(newParam));
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} role="form">
      <div className="flex">
        <input
          type="text"
          className={`form-control flex-1 mr-2 placeholder-gray-500 dark:placeholder-white`}
          placeholder="Enter a URL parameter (e.g., '/home')"
          {...register('title', { required: 'This field is required' })}
          onBlur={() => clearErrors('title')}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        <button type="submit" className="btn-outlined">
          {basicMode ? 'Go' : 'Add'}
        </button>
      </div>
      {errors.title && (
        <p id="title-error" className="mt-2 text-red-500">
          {errors.title.message}
        </p>
      )}
    </form>
  );
};

export default Form;
