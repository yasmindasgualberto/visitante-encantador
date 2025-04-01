import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import CompanyForm from '@/components/admin/CompanyForm';
import { getCompanies, createCompany, updateCompany, deleteCompany } from '@/services/supabase/companiesService';
import { Company } from '@/types';
import { ClientsHeader } from '@/components/admin/ClientsHeader';
import { ClientsSearch } from '@/components/admin/ClientsSearch';
import { ClientsTable } from '@/components/admin/ClientsTable';
import { ClientsPagination } from '@/components/admin/ClientsPagination';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const Clients: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingCompany, setViewingCompany] = useState<Company | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items to display per page
  
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
    console.log("Editando empresa:", company);
    setEditingCompany(company);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleViewCompany = (company: Company) => {
    setViewingCompany(company);
    setIsDetailsOpen(true);
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
      if (isEditing && editingCompany?.id) {
        await updateCompany(editingCompany.id, data);
        setCompanies(companies.map(company => 
          company.id === editingCompany.id 
            ? { ...company, ...data, id: company.id }
            : company
        ));
        toast.success('Empresa atualizada com sucesso');
      } else {
        const newCompany = await createCompany(data);
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

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCompanies.slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

  return (
    <div className="space-y-6">
      <ClientsHeader onNewClient={handleOpenForm} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista de Clientes</CardTitle>
            <ClientsSearch 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
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
            <>
              <ClientsTable 
                companies={getCurrentPageData()} 
                onEditCompany={handleEditCompany}
                onDeleteCompany={handleDeleteCompany}
                onViewCompany={handleViewCompany}
              />
              
              {totalPages > 1 && (
                <ClientsPagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
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

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Empresa</DialogTitle>
            <DialogDescription>
              Informações completas sobre esta empresa
            </DialogDescription>
          </DialogHeader>
          
          {viewingCompany && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Nome da Empresa</h3>
                  <p className="text-base">{viewingCompany.companyName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Responsável</h3>
                  <p className="text-base">{viewingCompany.responsibleName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p className="text-base">{viewingCompany.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Senha</h3>
                  <p className="text-base">••••••••</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Plano</h3>
                  <p className="text-base">{getPlanLabel(viewingCompany.plan)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p className="text-base">{getStatusLabel(viewingCompany.status)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Cliente desde</h3>
                  <p className="text-base">{viewingCompany.createdAt}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDetailsOpen(false)}
              className="mt-4"
            >
              Fechar
            </Button>
            <Button 
              onClick={() => {
                setIsDetailsOpen(false);
                if (viewingCompany) handleEditCompany(viewingCompany);
              }}
              className="mt-4"
            >
              Editar Empresa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clients;
