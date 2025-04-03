
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getCompanyByEmail } from '@/services/supabase/companiesService';

export const AuthGuard = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Lista de rotas que não precisam de autenticação
  const publicRoutes = ['/', '/admin/login'];
  
  // Verifica se a rota atual é pública
  const isPublicRoute = publicRoutes.includes(location.pathname);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
        const userEmail = localStorage.getItem('userEmail');
        
        if (storedAuth && userEmail) {
          try {
            // Verify if company exists and is active
            const company = await getCompanyByEmail(userEmail);
            
            if (company && company.status === 'active') {
              setIsAuthenticated(true);
            } else {
              // Company is no longer active or doesn't exist
              localStorage.removeItem('isAuthenticated');
              localStorage.removeItem('userEmail');
              setIsAuthenticated(false);
              if (!isPublicRoute) {
                toast.error('Sua empresa não está mais ativa. Por favor, entre em contato com o administrador.');
              }
            }
          } catch (error) {
            console.error('Error checking company status:', error);
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [isPublicRoute]); // Removed location.pathname from dependencies to prevent infinite loop
  
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  // Se não estiver autenticado e a rota não for pública, redireciona para o login
  if (!isAuthenticated && !isPublicRoute) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  return <Outlet />;
};
