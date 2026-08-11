import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

const Main: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <main className="fade-in text-xs" role="main" key={location.pathname}>
      <div className="rounded-xl bg-card p-4 shadow-soft">{children}</div>
    </main>
  );
};

export default Main;
