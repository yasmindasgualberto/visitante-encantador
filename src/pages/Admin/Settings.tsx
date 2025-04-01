import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Mail, BellRing, Globe, Shield, User } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Schema for admin profile validation
const adminProfileSchema = z.object({
  name: z.string().min(2, 'Nome precisa ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres').optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
});

type AdminProfileFormValues = z.infer<typeof adminProfileSchema>;

const AdminSettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [adminData, setAdminData] = useState<{ name: string; email: string; phone: string }>({
    name: '',
    email: '',
    phone: ''
  });

  // Initialize the form with admin data
  const form = useForm<AdminProfileFormValues>({
    resolver: zodResolver(adminProfileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  // Fetch admin data on component mount
  useEffect(() => {
    const fetchAdminData = async () => {
      // In a real scenario, you would get this from the authenticated admin session
      // For now, we'll use the email from localStorage
      const email = localStorage.getItem('adminEmail');
      
      if (email) {
        try {
          // Fetch admin data from the database
          const { data, error } = await supabase
            .from('companies')
            .select('responsible_name, email, phone')
            .eq('email', email)
            .single();
          
          if (error) {
            console.error('Error fetching admin data:', error);
            toast.error('Erro ao carregar dados do administrador: ' + error.message);
            return;
          }
          
          if (data) {
            // Make sure we have valid data before updating state
            setAdminData({
              name: data.responsible_name || '',
              email: data.email || '',
              phone: data.phone || ''
            });
            
            // Update form values
            form.reset({
              name: data.responsible_name || '',
              email: data.email || '',
              phone: data.phone || '',
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            });
          }
        } catch (error) {
          console.error('Error fetching admin data:', error);
          toast.error('Erro ao carregar dados do administrador');
        }
      }
    };
    
    fetchAdminData();
  }, [form]);

  const onSubmit = async (data: AdminProfileFormValues) => {
    setIsLoading(true);
    
    try {
      // Verify current password
      const email = localStorage.getItem('adminEmail');
      
      if (!email) {
        toast.error('Sessão de administrador não encontrada');
        setIsLoading(false);
        return;
      }
      
      // Verify current password
      const { data: adminData, error: fetchError } = await supabase
        .from('companies')
        .select('password')
        .eq('email', email)
        .single();
      
      if (fetchError) {
        toast.error('Erro ao verificar senha: ' + fetchError.message);
        setIsLoading(false);
        return;
      }
      
      // Simple password check (in a real app, you would use proper password hashing)
      if (adminData?.password !== data.currentPassword) {
        toast.error('Senha atual incorreta');
        setIsLoading(false);
        return;
      }
      
      // Update admin profile
      const updateData: any = {
        responsible_name: data.name,
        email: data.email,
        phone: data.phone || null // Ensure phone is included in update
      };
      
      // If new password is provided, update it
      if (data.newPassword) {
        updateData.password = data.newPassword;
      }
      
      const { error: updateError } = await supabase
        .from('companies')
        .update(updateData)
        .eq('email', email);
      
      if (updateError) {
        toast.error('Erro ao atualizar perfil: ' + updateError.message);
        setIsLoading(false);
        return;
      }
      
      // Update localStorage with new email if it changed
      if (data.email !== email) {
        localStorage.setItem('adminEmail', data.email);
      }
      
      toast.success('Perfil de administrador atualizado com sucesso');
      
      // Reset password fields
      form.setValue('currentPassword', '');
      form.setValue('newPassword', '');
      form.setValue('confirmPassword', '');
    } catch (error) {
      console.error('Error updating admin profile:', error);
      toast.error('Erro ao atualizar perfil de administrador');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema administrativo
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Perfil do Administrador</CardTitle>
              <CardDescription>
                Atualize seus dados de administrador e credenciais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="border-t border-zinc-800 my-6 pt-6">
                    <h3 className="text-lg font-medium mb-4">Alterar Senha</h3>
                    
                    <FormField
                      control={form.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha Atual</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nova Senha</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar Nova Senha</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                    <Save className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Ajuste as configurações gerais do sistema administrativo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Nome da Empresa</Label>
                <Input id="company-name" defaultValue="Portal de Visitantes" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email de Contato</Label>
                <Input id="contact-email" type="email" defaultValue="contato@portal.com" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="maintenance-mode" />
                <Label htmlFor="maintenance-mode">Modo de Manutenção</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>
                Gerencie como as notificações são enviadas aos usuários
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <Label htmlFor="email-notifications">Notificações por Email</Label>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BellRing className="h-4 w-4" />
                  <Label htmlFor="system-notifications">Notificações do Sistema</Label>
                </div>
                <Switch id="system-notifications" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Salvar Preferências
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Configure as opções de segurança do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <Label htmlFor="two-factor">Autenticação de Dois Fatores</Label>
                </div>
                <Switch id="two-factor" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password-policy">Política de Senhas</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="uppercase" defaultChecked />
                    <Label htmlFor="uppercase">Letra maiúscula</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="lowercase" defaultChecked />
                    <Label htmlFor="lowercase">Letra minúscula</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="number" defaultChecked />
                    <Label htmlFor="number">Número</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="special" defaultChecked />
                    <Label htmlFor="special">Caractere especial</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de API</CardTitle>
              <CardDescription>
                Gerencie as chaves de API e integrações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Chave de API</Label>
                <div className="flex gap-2">
                  <Input id="api-key" defaultValue="sk_test_••••••••••••••••••••••••" readOnly />
                  <Button variant="outline">Gerar Nova</Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <Label htmlFor="enable-api">Habilitar API</Label>
                </div>
                <Switch id="enable-api" defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
