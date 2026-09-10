import { Outlet } from 'react-router-dom';

import Header from '@/components/header/Header';
import Main from '@/components/main/Main';
import SupportPopup from '@/components/support-popup/SupportPopup';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/providers/theme-provider';

const RootLayout = () => {
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
