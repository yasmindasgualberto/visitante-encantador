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

const Clients: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Partial<Company> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
        const newCompany = await createCompany(data);
        setCompanies([...companies, newCompany]);
        toast.success('Empresa cadastrada com sucesso');
      }
      
      setIsFormOpen(false);
    } catch (error) {
      toast.error('Erro ao salvar empresa');
    }
  };

  // Filter companies based on search term
  const filteredCompanies = companies.filter(company => 
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.responsibleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  
  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCompanies.slice(startIndex, endIndex);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
              />
              
              {/* Only show pagination if we have more than one page */}
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
    </div>
  );
};

export default Clients;
