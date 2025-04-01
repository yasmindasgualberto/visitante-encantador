
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, LockOpen, Lock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getCompanies, updateCompany } from '@/services/supabase/companiesService';
import { Company } from '@/types';

const AccessControl: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [autoBlockDays, setAutoBlockDays] = useState(5);
  const [notificationDays, setNotificationDays] = useState(3);
  const [autoBlockEnabled, setAutoBlockEnabled] = useState(true);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [autoUnblockEnabled, setAutoUnblockEnabled] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompanies(data);
        setFilteredCompanies(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar empresas:', error);
        toast.error('Erro ao carregar dados das empresas');
        setIsLoading(false);
      }
    };
    
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = companies.filter(company => 
        company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCompanies(filtered);
    } else {
      setFilteredCompanies(companies);
    }
  }, [searchTerm, companies]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleToggleAccess = async (company: Company) => {
    try {
      const newStatus = company.status === 'active' ? 'blocked' : 'active';
      await updateCompany(company.id, { status: newStatus });
      
      // Update local state
      setCompanies(companies.map(c => 
        c.id === company.id ? { ...c, status: newStatus } : c
      ));
      
      toast.success(`Acesso ${newStatus === 'active' ? 'liberado' : 'bloqueado'} com sucesso`);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status da empresa');
    }
  };

  const formatLastAccess = (createdAt: string) => {
    // This is just a placeholder, in a real app you would track last login
    // For demo purposes, we'll use the createdAt date
    const today = new Date();
    const creationDate = new Date(createdAt);
    
    if (today.toDateString() === creationDate.toDateString()) {
      return `Hoje, ${creationDate.getHours()}:${String(creationDate.getMinutes()).padStart(2, '0')}`;
    } else {
      return createdAt;
    }
  };

  const getPaymentStatus = (company: Company) => {
    // This is a placeholder - in a real app, you would check payment status
    // For demo purposes, we'll consider 'active' companies as paid
    return company.status === 'active' ? 'Em dia' : 'Atrasado';
  };

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
                  value={searchTerm}
                  onChange={handleSearchChange}
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
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
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
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">{company.companyName}</TableCell>
                      <TableCell>{company.plan === 'basic' ? 'Básico' : company.plan === 'professional' ? 'Profissional' : 'Enterprise'}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          getPaymentStatus(company) === 'Em dia' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {getPaymentStatus(company)}
                        </span>
                      </TableCell>
                      <TableCell>{formatLastAccess(company.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id={`access-${company.id}`} 
                            checked={company.status === 'active'}
                            onCheckedChange={() => handleToggleAccess(company)}
                          />
                          <Label htmlFor={`access-${company.id}`}>
                            {company.status === 'active' ? 'Ativo' : 'Bloqueado'}
                          </Label>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleToggleAccess(company)}
                        >
                          {company.status === 'active' ? (
                            <>
                              <Lock className="h-4 w-4 mr-2" />
                              Bloquear
                            </>
                          ) : (
                            <>
                              <LockOpen className="h-4 w-4 mr-2" />
                              Liberar
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      {searchTerm ? 'Nenhuma empresa encontrada com este termo' : 'Nenhuma empresa cadastrada'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
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
                  value={autoBlockDays}
                  onChange={(e) => setAutoBlockDays(Number(e.target.value))}
                />
                <span className="text-sm">dias</span>
                <Switch 
                  id="auto-block" 
                  checked={autoBlockEnabled}
                  onCheckedChange={setAutoBlockEnabled}
                />
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
                  value={notificationDays}
                  onChange={(e) => setNotificationDays(Number(e.target.value))}
                />
                <span className="text-sm">dias antes</span>
                <Switch 
                  id="payment-notification" 
                  checked={notificationEnabled}
                  onCheckedChange={setNotificationEnabled}
                />
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
                <Switch 
                  id="auto-unblock" 
                  checked={autoUnblockEnabled}
                  onCheckedChange={setAutoUnblockEnabled}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessControl;
