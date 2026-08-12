import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { showToast } from '@/utils/utils';

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    onSubmit(inputValue);
    setInputValue('');

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
          className="text-xs flex-1"
          placeholder={placeholder}
          value={inputValue}
          autoFocus={autofocus}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button type="submit" variant="outline" className="text-xs uppercase" disabled={!inputValue.trim()}>
          {button}
        </Button>
      </div>
    </form>
  );
};

export default Form;
