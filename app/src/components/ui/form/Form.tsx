import { useId, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { showToast } from '@/utils/utils';
import { cn } from '@/lib/utils';

interface FormType {
  label: string;
  placeholder: string;
  button: string;
  autofocus?: boolean;
  className?: string;
  toastMessage?: (value?: string) => React.ReactNode;
  onSubmit: (value: string) => void;
}

const Form: React.FC<FormType> = ({
  label,
  placeholder,
  button,
  autofocus,
  className = '',
  toastMessage,
  onSubmit,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const errorId = useId();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setError('Please enter a URL parameter');
      return;
    }

    onSubmit(inputValue);
    setInputValue('');
    setError('');

    if (toastMessage) {
      showToast(toastMessage(inputValue));
    }
  };

  return (
    <form onSubmit={handleSubmit} role="form" className={className}>
      <label className="pb-1 block text-xxs uppercase opacity-50">{label}</label>
      <div className="flex gap-2">
        <Input
          type="text"
          className={cn('text-xs flex-1', error && 'border-red-500 focus-visible:ring-red-500')}
          placeholder={placeholder}
          value={inputValue}
          autoFocus={autofocus}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (error) setError('');
          }}
        />
        <Button type="submit" variant="outline" className="text-xs uppercase">
          {button}
        </Button>
      </div>
      {error && (
        <div id={errorId} role="alert" className="mt-1 flex items-center gap-1 text-red-500 dark:text-red-400">
          {error}
        </div>
      )}
    </form>
  );
};

export default Form;
