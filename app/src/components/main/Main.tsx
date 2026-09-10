import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import UpdateInfo from '@/routes/dashboard/components/UpdateInfo';

const Main = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <main className="fade-in text-xs" key={location.pathname}>
      <UpdateInfo />
      <div className="rounded-xl bg-card p-4 shadow-soft">{children}</div>
    </main>
  );
};

export default Main;
