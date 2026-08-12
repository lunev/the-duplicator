import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import UpdateInfo from '@/routes/dashboard/components/updates/UpdateInfo';

const Main: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <main className="fade-in text-xs" role="main" key={location.pathname}>
      <UpdateInfo />
      <div className="rounded-xl bg-card p-4 shadow-soft">{children}</div>
    </main>
  );
};

export default Main;
