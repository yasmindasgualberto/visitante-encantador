
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Settings } from 'lucide-react';
import { AdminLoginForm } from '@/components/auth/AdminLoginForm';

const AdminLogin: React.FC = () => {
  const isAdminAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
  
  // Se estiver autenticado como admin, redirecionar para o dashboard
  if (isAdminAuthenticated) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-zinc-950">
      <Card className="w-full max-w-md shadow-lg border-zinc-800 bg-zinc-900 text-zinc-200">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Settings className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Painel Administrativo</CardTitle>
          <CardDescription className="text-zinc-400">
            Entre com suas credenciais de administrador
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminLoginForm />
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center text-center text-sm text-zinc-500">
          <div className="flex items-center gap-1 text-xs mt-2">
            <ShieldCheck className="h-3 w-3" />
            <span>Acesso restrito a administradores do sistema</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
