
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
