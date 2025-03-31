
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, LockOpen, Lock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const AccessControl: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Controle de Acesso</h1>
        <p className="text-muted-foreground">
          Gerencie o acesso dos clientes ao sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Clientes e Acesso</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar cliente..."
                  className="pl-8 w-[250px]"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            Gerencie o acesso dos clientes conforme o status de pagamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status Pagamento</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead>Status Acesso</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Empresa ABC</TableCell>
                <TableCell>Profissional</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Em dia
                  </span>
                </TableCell>
                <TableCell>Hoje, 14:32</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch id="abc-access" defaultChecked />
                    <Label htmlFor="abc-access">Ativo</Label>
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    <Lock className="h-4 w-4 mr-2" />
                    Bloquear
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Empresa XYZ</TableCell>
                <TableCell>Básico</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                    Atrasado
                  </span>
                </TableCell>
                <TableCell>01/04/2023</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch id="xyz-access" />
                    <Label htmlFor="xyz-access">Bloqueado</Label>
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    <LockOpen className="h-4 w-4 mr-2" />
                    Liberar
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Empresa 123</TableCell>
                <TableCell>Enterprise</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Em dia
                  </span>
                </TableCell>
                <TableCell>Ontem, 09:15</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch id="123-access" defaultChecked />
                    <Label htmlFor="123-access">Ativo</Label>
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    <Lock className="h-4 w-4 mr-2" />
                    Bloquear
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configurações Automáticas</CardTitle>
          <CardDescription>
            Configure regras automáticas para controle de acesso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Bloqueio automático</h4>
                <p className="text-sm text-muted-foreground">
                  Bloquear acesso automaticamente após X dias de atraso no pagamento
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  className="w-16"
                  defaultValue="5"
                />
                <span className="text-sm">dias</span>
                <Switch id="auto-block" defaultChecked />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Notificação de atraso</h4>
                <p className="text-sm text-muted-foreground">
                  Enviar notificação ao cliente quando o pagamento estiver próximo do vencimento
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  className="w-16"
                  defaultValue="3"
                />
                <span className="text-sm">dias antes</span>
                <Switch id="payment-notification" defaultChecked />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Liberação automática</h4>
                <p className="text-sm text-muted-foreground">
                  Liberar acesso automaticamente após confirmação de pagamento
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="auto-unblock" defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessControl;
