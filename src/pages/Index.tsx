
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPlus, ClipboardList, DoorOpen, Clock, UserCheck } from 'lucide-react';
import { Visit } from '@/types';
import { getActiveVisits, getVisits } from '@/services/mockData';
import { toast } from 'sonner';

const Index = () => {
  const [activeVisits, setActiveVisits] = useState<Visit[]>([]);
  const [recentVisits, setRecentVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const active = await getActiveVisits();
        setActiveVisits(active);
        
        const all = await getVisits();
        setRecentVisits(all.slice(0, 5));
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados das visitas');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6 animate-enter">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Portal de Visitantes</h1>
          <p className="text-muted-foreground">
            Gerencie as entradas e saídas de visitantes do prédio.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button asChild>
            <Link to="/nova-visita" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Registrar Nova Visita
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/visitantes/novo" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Cadastrar Visitante
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Visitas Ativas</CardTitle>
            <DoorOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeVisits.length}</div>
            <p className="text-xs text-muted-foreground">
              visitantes atualmente no prédio
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="w-full">
              <Link to="/visitas-ativas">Ver detalhes</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Visitas Hoje</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              visitas registradas hoje
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="w-full">
              <Link to="/relatorios">Ver relatório</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total de Visitantes</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              visitantes cadastrados
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" asChild className="w-full">
              <Link to="/visitantes">Ver cadastros</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Visitas Recentes</CardTitle>
          <CardDescription>
            Lista das últimas visitas registradas no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Carregando visitas...</div>
          ) : recentVisits.length > 0 ? (
            <div className="space-y-4">
              {recentVisits.map((visit) => (
                <div key={visit.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex flex-col">
                    <div className="font-medium">{visit.visitor?.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {visit.room?.name}, {visit.responsible}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Entrada: {formatDate(visit.entryTime)}
                      {visit.exitTime && ` • Saída: ${formatDate(visit.exitTime)}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={visit.status === 'active' ? 'default' : 'secondary'}>
                      {visit.status === 'active' ? 'Ativa' : 'Concluída'}
                    </Badge>
                    <Button size="sm" variant="ghost" asChild>
                      <Link to={`/visitas/${visit.id}`}>Detalhes</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma visita registrada ainda.
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link to="/relatorios" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Ver Relatório Completo
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Index;
