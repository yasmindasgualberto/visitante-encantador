
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserRound, Building2, Clipboard, Activity, Settings, LogOut } from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { toast } from 'sonner';

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    toast.success('Sessão encerrada com sucesso');
    navigate('/');
  };
  
  const menuItems = [
    {
      title: "Registro de Visitas",
      icon: Activity,
      url: "/nova-visita",
    },
    {
      title: "Visitantes",
      icon: UserRound,
      url: "/visitantes",
    },
    {
      title: "Salas",
      icon: Building2,
      url: "/salas",
    },
    {
      title: "Relatórios",
      icon: Clipboard,
      url: "/relatorios",
    },
    {
      title: "Configurações",
      icon: Settings,
      url: "/configuracoes",
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4">
          <h1 className="text-xl font-bold text-primary">Visitante Encantador</h1>
          <p className="text-sm text-muted-foreground">Sistema de Controle de Acesso</p>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="mt-auto p-4 border-t border-sidebar-border">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-full px-3 py-2 rounded-md hover:bg-secondary/50"
        >
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </button>
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
