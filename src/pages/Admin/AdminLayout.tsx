import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import AdminMenu from '@/components/admin/AdminMenu';

const AdminLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminMenu />
        
        <main className="flex-1 flex flex-col min-h-screen relative">
          <div className="p-4 border-b flex items-center justify-between bg-zinc-50">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium">Área Administrativa</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Admin</span>
            </div>
          </div>
          
          <div className="flex-1 p-6 overflow-auto">
            <Outlet />
          </div>
          
          <footer className="p-4 text-center text-sm text-muted-foreground border-t">
            © {new Date().getFullYear()} Visitante Encantador - Painel Administrativo
            <br />
            Desenvolvido por Ivan Guallberto
          </footer>
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
};

export default AdminLayout;
