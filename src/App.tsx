
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import VisitorsList from "./pages/VisitorsList";
import VisitorForm from "./pages/VisitorForm";
import RoomsList from "./pages/RoomsList";
import RoomForm from "./pages/RoomForm";
import VisitForm from "./pages/VisitForm";
import VisitDetails from "./pages/VisitDetails";
import ActiveVisits from "./pages/ActiveVisits";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

// Admin pages
import AdminLogin from "./pages/Admin/Login";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/Dashboard";
import Subscriptions from "./pages/Admin/Subscriptions";
import Clients from "./pages/Admin/Clients";
import CompanyReports from "./pages/Admin/CompanyReports";
import AccessControl from "./pages/Admin/AccessControl";
import AdminReports from "./pages/Admin/Reports";
import AdminSettings from "./pages/Admin/Settings";
import { AuthGuard } from "./components/AuthGuard";
import { AdminGuard } from "./components/AdminGuard";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Routes>
          {/* Rota pública (login) */}
          <Route path="/" element={<Index />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Rotas protegidas */}
          <Route element={<AuthGuard />}>
            <Route element={<Layout />}>
              <Route path="/visitantes" element={<VisitorsList />} />
              <Route path="/visitantes/novo" element={<VisitorForm />} />
              <Route path="/visitantes/:id" element={<VisitorForm />} />
              <Route path="/visitantes/editar/:id" element={<VisitorForm />} />
              <Route path="/salas" element={<RoomsList />} />
              <Route path="/salas/nova" element={<RoomForm />} />
              <Route path="/salas/editar/:id" element={<RoomForm />} />
              <Route path="/nova-visita" element={<VisitForm />} />
              <Route path="/visitas/:id" element={<VisitDetails />} />
              <Route path="/visitas-ativas" element={<ActiveVisits />} />
              <Route path="/relatorios" element={<Reports />} />
              <Route path="/configuracoes" element={<Settings />} />
            </Route>
          </Route>
          
          {/* Admin Routes (protected with AdminGuard) */}
          <Route element={<AdminGuard />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="assinaturas" element={<Subscriptions />} />
              <Route path="clientes" element={<Clients />} />
              <Route path="clientes/relatorios/:id" element={<CompanyReports />} />
              <Route path="acesso" element={<AccessControl />} />
              <Route path="relatorios" element={<AdminReports />} />
              <Route path="configuracoes" element={<AdminSettings />} />
            </Route>
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
