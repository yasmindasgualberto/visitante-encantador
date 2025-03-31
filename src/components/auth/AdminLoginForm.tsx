
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { LogIn, Shield } from 'lucide-react';
import { verifyAdminCredentials } from '@/services/supabase/companiesService';

const adminLoginSchema = z.object({
  email: z.string().email('Digite um email válido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export function AdminLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: AdminLoginFormValues) {
    setIsLoading(true);
    
    try {
      const isValidAdmin = await verifyAdminCredentials(data.email, data.password);
      
      if (isValidAdmin) {
        // Em um cenário real, armazenaria um token JWT específico para admin
        localStorage.setItem('isAdminAuthenticated', 'true');
        toast.success('Login administrativo realizado com sucesso!');
        navigate('/admin');
      } else {
        toast.error('Credenciais inválidas. Acesso administrativo negado.');
      }
    } catch (error) {
      toast.error('Erro ao fazer login administrativo. Tente novamente.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input 
                  placeholder="admin@sistema.com" 
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
          {isLoading ? 'Autenticando...' : 'Entrar como Administrador'}
          <Shield className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
}
