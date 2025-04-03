
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserPlus, Search, User, Edit, Eye } from 'lucide-react';
import { getVisitors } from '@/services/supabase/visitorsService';
import { Visitor } from '@/types';
import { toast } from 'sonner';

const VisitorsList = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        console.log('Fetching visitors...');
        const data = await getVisitors();
        console.log('Visitors fetched:', data);
        setVisitors(data);
        setFilteredVisitors(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar visitantes:', error);
        toast.error('Erro ao carregar a lista de visitantes');
        setIsLoading(false);
      }
    };

    fetchVisitors();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredVisitors(visitors);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = visitors.filter(
        visitor =>
          visitor.name.toLowerCase().includes(term) ||
          visitor.document.toLowerCase().includes(term) ||
          (visitor.company && visitor.company.toLowerCase().includes(term))
      );
      setFilteredVisitors(filtered);
    }
  }, [searchTerm, visitors]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6 animate-enter">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Visitantes</h1>
          <p className="text-muted-foreground">
            Gerencie o cadastro de visitantes do prédio.
          </p>
        </div>
        <Button asChild>
          <Link to="/visitantes/novo" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Cadastrar Novo Visitante
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Visitantes Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, documento ou empresa..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Carregando visitantes...</div>
          ) : filteredVisitors.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Cadastrado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVisitors.map((visitor) => (
                    <TableRow key={visitor.id}>
                      <TableCell>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                          {visitor.photo ? (
                            <img
                              src={visitor.photo}
                              alt={visitor.name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{visitor.name}</TableCell>
                      <TableCell>{visitor.document}</TableCell>
                      <TableCell>{visitor.company || '-'}</TableCell>
                      <TableCell>{formatDate(visitor.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/visitantes/${visitor.id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Ver detalhes</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/visitantes/editar/${visitor.id}`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? 'Nenhum visitante encontrado para esta busca.'
                : 'Nenhum visitante cadastrado ainda.'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VisitorsList;
