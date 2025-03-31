
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { LogIn, Building } from 'lucide-react';

// Simulando um serviço de autenticação
const mockVerifyCredentials = (email: string, password: string): Promise<boolean> => {
  // Em um cenário real, isso seria uma chamada à API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Lista fictícia de empresas autorizadas
      const authorizedCompanies = [
        { email: 'empresa@exemplo.com', password: 'senha123' },
        { email: 'admin@sistema.com', password: 'admin123' }
      ];
      
      const isValid = authorizedCompanies.some(
        company => company.email === email && company.password === password
      );
      
      resolve(isValid);
    }, 800);
  });
};

const loginSchema = z.object({
  email: z.string().email('Digite um email válido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    
    try {
      const isValid = await mockVerifyCredentials(data.email, data.password);
      
      if (isValid) {
        // Em um cenário real, armazenaria o token JWT
        localStorage.setItem('isAuthenticated', 'true');
        toast.success('Login realizado com sucesso!');
        navigate('/visitantes');
      } else {
        toast.error('Credenciais inválidas. Empresa não autorizada.');
      }
    } catch (error) {
      toast.error('Erro ao fazer login. Tente novamente.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-sm">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input 
                  placeholder="email@empresa.com" 
                  type="email" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input 
                  placeholder="********" 
                  type="password" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? 'Autenticando...' : 'Entrar'}
          <LogIn className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
}
