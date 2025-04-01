
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getAdminByEmail } from '@/services/supabase/companiesService';

export const AdminGuard = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const isAdminAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
      const adminEmail = localStorage.getItem('adminEmail');
      
      if (isAdminAuthenticated && adminEmail) {
        try {
          // Verify if admin exists in database
          const admin = await getAdminByEmail(adminEmail);
          
          if (admin) {
            setIsAuthenticated(true);
          } else {
            // Admin doesn't exist or data issue
            localStorage.removeItem('isAdminAuthenticated');
            localStorage.removeItem('adminEmail');
            setIsAuthenticated(false);
            toast.error('Sessão de administrador inválida. Por favor, faça login novamente.');
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);  // Remove location.pathname from dependency array to prevent infinite loops
  
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  // Se não estiver autenticado como admin, redireciona para o login de admin
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  return <Outlet />;
};
