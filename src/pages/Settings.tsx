
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings2, Save } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const handleSaveSettings = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  return (
    <div className="space-y-6 animate-enter">
      <div className="flex items-center gap-2">
        <Settings2 className="h-6 w-6" />
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
      </div>
      <p className="text-muted-foreground">
        Personalize as configurações do sistema de controle de visitantes.
      </p>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações Gerais</CardTitle>
            <CardDescription>
              Ajuste as configurações básicas do sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nome da Empresa/Condomínio</Label>
              <Input
                id="companyName"
                defaultValue="Condomínio Modelo"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                defaultValue="Av. Principal, 1000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Email do Administrador</Label>
              <Input
                id="adminEmail"
                type="email"
                defaultValue="admin@exemplo.com"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notificações por Email</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações por email quando um visitante for registrado
                </p>
              </div>
              <Switch id="notifications" defaultChecked />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveSettings} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Salvar Configurações
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Crachá</CardTitle>
            <CardDescription>
              Personalize as configurações dos crachás de visitantes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="qrcode">Usar QR Code</Label>
                <p className="text-sm text-muted-foreground">
                  Gerar QR Code nos crachás de visitantes
                </p>
              </div>
              <Switch id="qrcode" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="barcode">Usar Código de Barras</Label>
                <p className="text-sm text-muted-foreground">
                  Gerar código de barras nos crachás de visitantes
                </p>
              </div>
              <Switch id="barcode" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="photo">Exigir Foto</Label>
                <p className="text-sm text-muted-foreground">
                  Exigir foto do visitante para registro
                </p>
              </div>
              <Switch id="photo" defaultChecked />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveSettings} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Salvar Configurações
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
