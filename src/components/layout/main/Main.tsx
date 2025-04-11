import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

const Main: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <main
      className="p-4 m-3 mt-0 bg-gray-50 dark:bg-neutral-900 rounded-xl text-sm fade-in"
      key={location.pathname}
      role="main"
    >
      {children}
    </main>
  );
};

export default Main;
