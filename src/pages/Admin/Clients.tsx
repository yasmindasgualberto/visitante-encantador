
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus, Eye, Edit, Trash, BarChart } from 'lucide-react';
import { toast } from 'sonner';
import CompanyForm from '@/components/admin/CompanyForm';
import { getCompanies, addCompany, updateCompany, deleteCompany } from '@/services/mockData';
import { Company } from '@/types';

const Clients: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Partial<Company> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompanies(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar empresas:', error);
        toast.error('Erro ao carregar dados das empresas');
        setIsLoading(false);
      }
    };
    
    fetchCompanies();
  }, []);

  const handleOpenForm = () => {
    setIsFormOpen(true);
    setIsEditing(false);
    setEditingCompany(null);
  };

  const handleEditCompany = (company: Company) => {
    setIsEditing(true);
    setEditingCompany(company);
    setIsFormOpen(true);
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta empresa?')) {
      try {
        await deleteCompany(companyId);
        setCompanies(companies.filter(company => company.id !== companyId));
        toast.success('Empresa excluída com sucesso');
      } catch (error) {
        toast.error('Erro ao excluir empresa');
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (isEditing && editingCompany) {
        // Atualiza empresa existente
        const updated = await updateCompany(editingCompany.id!, data);
        setCompanies(companies.map(company => 
          company.id === editingCompany.id 
            ? { ...company, ...updated }
            : company
        ));
        toast.success('Empresa atualizada com sucesso');
      } else {
        // Adiciona nova empresa
        const newCompany = await addCompany(data);
        setCompanies([...companies, newCompany]);
        toast.success('Empresa cadastrada com sucesso');
      }
      
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Erro ao salvar empresa');
    }
  };

  const filteredCompanies = companies.filter(company => 
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.responsibleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'blocked':
        return 'Bloqueado';
      case 'pending':
        return 'Pendente';
      default:
        return status;
    }
  };

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case 'basic':
        return 'Básico';
      case 'professional':
        return 'Profissional';
      case 'enterprise':
        return 'Enterprise';
      default:
        return plan;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie os clientes cadastrados no sistema
          </p>
        </div>
        <Button onClick={handleOpenForm}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Clientes</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar cliente..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            Informações detalhadas de todos os clientes cadastrados
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
                  <TableHead>Empresa</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assinante desde</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">{company.companyName}</TableCell>
                      <TableCell>{company.responsibleName}</TableCell>
                      <TableCell>{getPlanLabel(company.plan)}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(company.status)}`}>
                          {getStatusLabel(company.status)}
                        </span>
                      </TableCell>
                      <TableCell>{company.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link to={`/admin/clientes/relatorios/${company.id}`}>
                            <Button variant="outline" size="icon" title="Ver relatórios">
                              <BarChart className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleEditCompany(company)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="text-destructive"
                            onClick={() => handleDeleteCompany(company.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Nenhuma empresa encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CompanyForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingCompany || {}}
        isEditing={isEditing}
      />
    </div>
  );
};

export default Clients;
