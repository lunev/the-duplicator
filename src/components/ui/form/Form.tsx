import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { showToast } from '@/utils/utils';
import styles from './Form.module.css';

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
      <label className={styles.label}>{label}</label>
      <div className={styles.formGroup}>
        <Input
          type="text"
          className={styles.input}
          placeholder={placeholder}
          value={inputValue}
          required
          autoFocus={autofocus}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button type="submit" variant="outline" className={styles.button}>
          {button}
        </Button>
      </div>
    </form>
  );
};

export default Form;
