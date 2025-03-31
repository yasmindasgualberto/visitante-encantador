
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserPlus, Search, Check, Eye } from 'lucide-react';
import { Visit } from '@/types';
import { toast } from 'sonner';
import { getActiveVisits, checkoutVisit } from '@/services/supabaseService';

const ActiveVisits = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [filteredVisits, setFilteredVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const data = await getActiveVisits();
      setVisits(data);
      setFilteredVisits(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao carregar visitas ativas:', error);
      toast.error('Erro ao carregar a lista de visitas ativas');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredVisits(visits);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = visits.filter(
        visit =>
          (visit.visitor?.name && visit.visitor.name.toLowerCase().includes(term)) ||
          (visit.visitor?.document && visit.visitor.document.toLowerCase().includes(term)) ||
          (visit.room?.name && visit.room.name.toLowerCase().includes(term)) ||
          visit.responsible.toLowerCase().includes(term) ||
          visit.badgeCode.toLowerCase().includes(term)
      );
      setFilteredVisits(filtered);
    }
  }, [searchTerm, visits]);

  const handleCheckout = async (id: string) => {
    try {
      await checkoutVisit(id);
      toast.success('Saída registrada com sucesso!');
      fetchVisits(); // Refresh the list
    } catch (error) {
      console.error('Erro ao registrar saída:', error);
      toast.error('Erro ao registrar saída');
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6 animate-enter">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Visitas Ativas</h1>
          <p className="text-muted-foreground">
            Gerencie os visitantes atualmente no prédio.
          </p>
        </div>
        <Button asChild>
          <Link to="/nova-visita" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Registrar Nova Visita
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visitantes Atualmente no Prédio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, documento, local..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Carregando visitas ativas...</div>
          ) : filteredVisits.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Crachá</TableHead>
                    <TableHead>Visitante</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Entrada</TableHead>
                    <TableHead>Acompanhantes</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVisits.map((visit) => (
                    <TableRow key={visit.id}>
                      <TableCell className="font-mono">{visit.badgeCode}</TableCell>
                      <TableCell>
                        <div className="font-medium">{visit.visitor?.name}</div>
                        <div className="text-sm text-muted-foreground">{visit.visitor?.document}</div>
                      </TableCell>
                      <TableCell>{visit.room?.name}</TableCell>
                      <TableCell>{visit.responsible}</TableCell>
                      <TableCell>{formatTime(visit.entryTime)}</TableCell>
                      <TableCell>{visit.companions.length}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/visitas/${visit.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              Detalhes
                            </Link>
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleCheckout(visit.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Saída
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
                ? 'Nenhuma visita ativa encontrada para esta busca.'
                : 'Não há visitantes no prédio no momento.'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActiveVisits;
