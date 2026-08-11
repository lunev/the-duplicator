import { Outlet } from 'react-router-dom';
import Header from '@/components/layout/header/Header';
import Main from '@/components/layout/main/Main';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';

const RootLayout: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Toaster />
    </ThemeProvider>
  );
};

export default RootLayout;
