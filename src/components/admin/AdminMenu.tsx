
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
import { LayoutDashboard, Users, CreditCard, Settings, ShieldAlert, LogOut, BarChart } from 'lucide-react';

const AdminMenu: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      url: "/admin",
    },
    {
      title: "Assinaturas",
      icon: CreditCard,
      url: "/admin/assinaturas",
    },
    {
      title: "Clientes",
      icon: Users,
      url: "/admin/clientes",
    },
    {
      title: "Controle de Acesso",
      icon: ShieldAlert,
      url: "/admin/acesso",
    },
    {
      title: "Relatórios",
      icon: BarChart,
      url: "/admin/relatorios",
    },
    {
      title: "Configurações",
      icon: Settings,
      url: "/admin/configuracoes",
    },
  ];

  return (
    <Sidebar className="bg-zinc-900 border-r border-zinc-800 text-zinc-200">
      <SidebarContent>
        <div className="p-4">
          <h1 className="text-xl font-bold text-white">Admin Portal</h1>
          <p className="text-sm text-zinc-400">Gestão de Assinaturas</p>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-400">Menu Administrativo</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className={`hover:bg-zinc-800 focus:bg-zinc-800 ${location.pathname === item.url ? 'bg-zinc-800 text-white' : ''}`}
                  >
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

      <div className="mt-auto p-4 border-t border-zinc-800">
        <button className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors w-full px-3 py-2 rounded-md hover:bg-zinc-800">
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </button>
      </div>
    </Sidebar>
  );
};

export default AdminMenu;
