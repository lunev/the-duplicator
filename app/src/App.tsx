import { HashRouter, Route, Routes } from 'react-router-dom';
import RootLayout from '@/routes/root/Root';
import Dashboard from '@/routes/dashboard/Dashboard';
import Groups from './routes/groups/Groups';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/groups" element={<Groups />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
