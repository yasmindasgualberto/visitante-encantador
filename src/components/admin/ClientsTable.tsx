
import React from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash, BarChart } from 'lucide-react';
import { Company } from '@/types';
import { ClientStatusBadge } from './ClientStatusBadge';

interface ClientsTableProps {
  companies: Company[];
  onEditCompany: (company: Company) => void;
  onDeleteCompany: (companyId: string) => void;
}

export const ClientsTable: React.FC<ClientsTableProps> = ({
  companies,
  onEditCompany,
  onDeleteCompany,
}) => {
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
        {companies.length > 0 ? (
          companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell className="font-medium">{company.companyName}</TableCell>
              <TableCell>{company.responsibleName}</TableCell>
              <TableCell>{getPlanLabel(company.plan)}</TableCell>
              <TableCell>
                <ClientStatusBadge status={company.status} />
              </TableCell>
              <TableCell>{company.createdAt}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Link to={`/admin/clientes/relatorios/${company.id}`}>
                    <Button variant="outline" size="icon" title="Ver relatórios">
                      <BarChart className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon" title="Ver detalhes">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    title="Editar cliente"
                    onClick={(e) => {
                      e.preventDefault();
                      onEditCompany(company);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-destructive"
                    title="Excluir cliente"
                    onClick={(e) => {
                      e.preventDefault();
                      onDeleteCompany(company.id);
                    }}
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
  );
};
