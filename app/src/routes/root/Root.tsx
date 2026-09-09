import { Outlet } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Main from '@/components/layout/Main';
import { Toaster } from '@/components/ui/toaster';
import SupportPopup from '@/components/support-popup';
import { ThemeProvider } from '@/components/theme-provider';

const RootLayout: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Toaster />
      <SupportPopup />
    </ThemeProvider>
  );
};

export default RootLayout;
