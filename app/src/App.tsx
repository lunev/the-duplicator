import { HashRouter, Route, Routes } from 'react-router-dom';

import { ROUTES } from '@/constants';
import Dashboard from '@/routes/dashboard/Dashboard';
import Groups from '@/routes/groups/Groups';
import ImportParams from '@/routes/import-params/ImportParams';
import RootLayout from '@/routes/root/Root';
import Settings from '@/routes/settings/Settings';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<RootLayout />}>
          <Route index element={<Dashboard />} />
          <Route path={ROUTES.GROUPS} element={<Groups />} />
          <Route path={ROUTES.IMPORT_PARAMS} element={<ImportParams />} />
          <Route path={ROUTES.SETTINGS} element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
