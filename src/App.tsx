
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import NotFound from './pages/NotFound';
import Index from './pages/Index';
import VisitorsList from './pages/VisitorsList';
import VisitorForm from './pages/VisitorForm';
import RoomsList from './pages/RoomsList';
import RoomForm from './pages/RoomForm';
import VisitForm from './pages/VisitForm';
import ActiveVisits from './pages/ActiveVisits';
import VisitDetails from './pages/VisitDetails';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AdminLayout from './pages/Admin/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import Clients from './pages/Admin/Clients';
import Subscriptions from './pages/Admin/Subscriptions';
import AdminReports from './pages/Admin/Reports';
import CompanyReports from './pages/Admin/CompanyReports';
import AccessControl from './pages/Admin/AccessControl';
import AdminSettings from './pages/Admin/Settings';
import AdminLogin from './pages/Admin/Login';
import { AdminGuard } from './components/AdminGuard';
import { AuthGuard } from './components/AuthGuard';
import { AdminInitializer } from './components/AdminInitializer';

function App() {
  return (
    <>
      <AdminInitializer />
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<AdminGuard />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="clientes" element={<Clients />} />
            <Route path="clientes/relatorios/:companyId" element={<CompanyReports />} />
            <Route path="assinaturas" element={<Subscriptions />} />
            <Route path="relatorios" element={<AdminReports />} />
            <Route path="acesso" element={<AccessControl />} />
            <Route path="configuracoes" element={<AdminSettings />} />
          </Route>
        </Route>
        
        {/* Client Routes */}
        <Route element={<AuthGuard />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/visitantes" element={<VisitorsList />} />
            <Route path="/visitantes/novo" element={<VisitorForm />} />
            <Route path="/visitantes/editar/:id" element={<VisitorForm />} />
            <Route path="/salas" element={<RoomsList />} />
            <Route path="/salas/nova" element={<RoomForm />} />
            <Route path="/salas/editar/:id" element={<RoomForm />} />
            <Route path="/visitas/nova" element={<VisitForm />} />
            <Route path="/visitas/ativas" element={<ActiveVisits />} />
            <Route path="/visitas/:id" element={<VisitDetails />} />
            <Route path="/relatorios" element={<Reports />} />
            <Route path="/configuracoes" element={<Settings />} />
          </Route>
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
