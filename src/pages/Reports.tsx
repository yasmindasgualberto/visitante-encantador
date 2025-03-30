
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar as CalendarIcon, FileDown, Search } from 'lucide-react';
import { getVisits } from '@/services/mockData';
import { Visit } from '@/types';
import { toast } from 'sonner';

const Reports = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [filteredVisits, setFilteredVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState('all');

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const data = await getVisits();
        setVisits(data);
        setFilteredVisits(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar visitas:', error);
        toast.error('Erro ao carregar dados para o relatório');
        setIsLoading(false);
      }
    };

    fetchVisits();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterPeriod, visits]);

  const applyFilters = () => {
    let filtered = [...visits];
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    switch (filterPeriod) {
      case 'today':
        filtered = visits.filter(visit => new Date(visit.entryTime) >= today);
        break;
      case 'week':
        filtered = visits.filter(visit => new Date(visit.entryTime) >= thisWeekStart);
        break;
      case 'month':
        filtered = visits.filter(visit => new Date(visit.entryTime) >= thisMonthStart);
        break;
      default:
        // all visits
        break;
    }
    
    setFilteredVisits(filtered);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const handleExport = () => {
    toast.success('Relatório exportado com sucesso!');
  };

  return (
    <div className="space-y-6 animate-enter">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground">
          Visualize e exporte relatórios de visitas.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Histórico de Visitas</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <Select
                value={filterPeriod}
                onValueChange={setFilterPeriod}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as visitas</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Esta semana</SelectItem>
                  <SelectItem value="month">Este mês</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <FileDown className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando dados...</div>
          ) : filteredVisits.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Visitante</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Entrada</TableHead>
                    <TableHead>Saída</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVisits.map((visit) => (
                    <TableRow key={visit.id}>
                      <TableCell>
                        <div className="font-medium">{visit.visitor?.name}</div>
                        <div className="text-sm text-muted-foreground">{visit.visitor?.document}</div>
                      </TableCell>
                      <TableCell>{visit.room?.name}</TableCell>
                      <TableCell>{visit.responsible}</TableCell>
                      <TableCell>{formatDate(visit.entryTime)}</TableCell>
                      <TableCell>
                        {visit.exitTime ? formatDate(visit.exitTime) : '-'}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          visit.status === 'active' 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {visit.status === 'active' ? 'Ativa' : 'Concluída'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma visita encontrada para o período selecionado.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
