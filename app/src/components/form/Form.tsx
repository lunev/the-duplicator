import { useId, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useTypewriter from '@/hooks/useTypewriter';
import { showToast } from '@/utils/utils';

interface FormType {
  label: string;
  placeholder?: string;
  button: string;
  autofocus?: boolean;
  className?: string;
  typingPlaceholders?: string[];
  toastMessage?: (value?: string) => React.ReactNode;
  onSubmit: (value: string) => void;
}

const Form = ({
  label,
  placeholder,
  button,
  autofocus,
  className = '',
  typingPlaceholders,
  toastMessage,
  onSubmit,
}: FormType) => {
  const [inputValue, setInputValue] = useState('');
  const animatedPlaceholder = useTypewriter(typingPlaceholders ?? []);
  const inputId = useId();

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
    <form onSubmit={handleSubmit} className={className}>
      <label htmlFor={inputId} className="pb-1 block text-xxs uppercase opacity-50">
        {label}
      </label>
      <div className="flex gap-2">
        <Input
          id={inputId}
          type="text"
          className="text-xs flex-1"
          placeholder={typingPlaceholders ? animatedPlaceholder || placeholder : placeholder}
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
