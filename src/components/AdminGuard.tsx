
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const AdminGuard = () => {
  const location = useLocation();
  const isAdminAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
  
  // Se não estiver autenticado como admin, redireciona para o login de admin
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  return <Outlet />;
};
