
import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, ShieldCheck, Shield } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Verificar se o usuário já está autenticado
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(auth);
  }, []);

  // Enquanto verificamos a autenticação
  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-pulse">Carregando...</div>
      </div>
    );
  }

  // Se estiver autenticado, redirecionar para a página principal
  if (isAuthenticated) {
    return <Navigate to="/visitantes" />;
  }

  // Se não estiver autenticado, mostrar o formulário de login
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] animate-enter">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Building className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Portal de Visitantes</CardTitle>
          <CardDescription>
            Entre com as credenciais da sua empresa para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center text-center text-sm text-muted-foreground">
          <div className="flex items-center gap-1 text-xs mt-2">
            <ShieldCheck className="h-3 w-3" />
            <span>Sistema exclusivo para empresas autorizadas</span>
          </div>
          
          <div className="w-full mt-6 pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              asChild
            >
              <Link to="/admin/login" className="flex items-center justify-center">
                <Shield className="mr-2 h-4 w-4" />
                Acesso Administrativo
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Index;
