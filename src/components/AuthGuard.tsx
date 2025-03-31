
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const AuthGuard = () => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  // Lista de rotas que não precisam de autenticação
  const publicRoutes = ['/', '/admin', '/admin/assinaturas', '/admin/clientes', '/admin/acesso', '/admin/relatorios', '/admin/configuracoes'];
  
  // Verifica se a rota atual é pública
  const isPublicRoute = publicRoutes.includes(location.pathname);
  
  // Se não estiver autenticado e a rota não for pública, redireciona para o login
  if (!isAuthenticated && !isPublicRoute) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  return <Outlet />;
};
