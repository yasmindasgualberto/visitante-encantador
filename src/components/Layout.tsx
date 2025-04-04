
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import { Toaster } from '@/components/ui/sonner';

const Layout: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Verificar se o usuário está autenticado
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(auth);
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {isAuthenticated && <AppSidebar />}
        
        <main className="flex-1 flex flex-col min-h-screen relative">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isAuthenticated && <SidebarTrigger />}
              <h2 className="text-lg font-medium">Portal de Visitantes</h2>
            </div>
          </div>
          
          <div className="flex-1 p-6 overflow-auto">
            <Outlet />
          </div>
          
          <footer className="p-4 text-center text-sm text-muted-foreground border-t">
            © {new Date().getFullYear()} Visitante Encantador - Sistema de Controle de Acesso
            <br />
            Desenvolvido por Ivan Guallberto
          </footer>
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
};

export default Layout;
