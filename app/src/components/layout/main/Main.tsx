import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Main.module.css';

const Main: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <main className={styles.main} role="main" key={location.pathname}>
      {children}
    </main>
  );
};

export default Main;
