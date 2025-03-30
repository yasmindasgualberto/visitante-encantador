
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, UserCheck, DoorOpen, Clock, Check, Printer } from 'lucide-react';
import { getVisitById, checkoutVisit } from '@/services/mockData';
import { Visit } from '@/types';
import VisitorBadge from '@/components/VisitorBadge';
import { toast } from 'sonner';

const VisitDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [visit, setVisit] = useState<Visit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchVisit = async () => {
      if (!id) return;
      
      try {
        const data = await getVisitById(id);
        setVisit(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar detalhes da visita:', error);
        toast.error('Erro ao carregar detalhes da visita');
        setIsLoading(false);
      }
    };

    fetchVisit();
  }, [id]);

  const handleCheckout = async () => {
    if (!id || !visit) return;
    
    setProcessing(true);
    
    try {
      const updatedVisit = await checkoutVisit(id);
      setVisit(updatedVisit);
      toast.success('Saída registrada com sucesso!');
    } catch (error) {
      console.error('Erro ao registrar saída:', error);
      toast.error('Erro ao registrar saída');
    } finally {
      setProcessing(false);
    }
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="max-w-3xl mx-auto animate-enter">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Visita não encontrada</h1>
          <p className="text-muted-foreground">
            A visita que você está procurando não existe ou foi removida.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-enter">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Detalhes da Visita</h1>
            <p className="text-muted-foreground">
              Visualize informações completas sobre a visita.
            </p>
          </div>
          <Badge variant={visit.status === 'active' ? 'default' : 'secondary'} className="text-sm py-1 px-3">
            {visit.status === 'active' ? 'Visita em Andamento' : 'Visita Concluída'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Visita</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Código do Crachá</p>
                  <p className="font-mono">{visit.badgeCode}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div>
                    <Badge variant={visit.status === 'active' ? 'default' : 'secondary'}>
                      {visit.status === 'active' ? 'Ativa' : 'Concluída'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    <Clock className="h-4 w-4 inline-block mr-1" />
                    Entrada
                  </p>
                  <p>{formatDateTime(visit.entryTime)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    <Clock className="h-4 w-4 inline-block mr-1" />
                    Saída
                  </p>
                  <p>{visit.exitTime ? formatDateTime(visit.exitTime) : '-'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  <DoorOpen className="h-4 w-4 inline-block mr-1" />
                  Local Visitado
                </p>
                <div className="p-3 border rounded-md">
                  <p className="font-medium">{visit.room?.name}</p>
                  <p className="text-sm text-muted-foreground">{visit.room?.floor}</p>
                  {visit.room?.description && (
                    <p className="text-sm mt-1">{visit.room.description}</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  <UserCheck className="h-4 w-4 inline-block mr-1" />
                  Responsável
                </p>
                <div className="p-3 border rounded-md">
                  <p>{visit.responsible}</p>
                </div>
              </div>

              {visit.companions.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Acompanhantes ({visit.companions.length})
                  </p>
                  <div className="border rounded-md divide-y">
                    {visit.companions.map((companion, index) => (
                      <div key={index} className="p-3">
                        <p className="font-medium">{companion.name}</p>
                        <p className="text-sm text-muted-foreground">{companion.document}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              {visit.status === 'active' && (
                <Button 
                  onClick={handleCheckout} 
                  disabled={processing}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Registrar Saída
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Visitante</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-2 overflow-hidden">
                  {visit.visitor?.photo ? (
                    <img 
                      src={visit.visitor.photo} 
                      alt={visit.visitor.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCheck className="w-10 h-10 text-muted-foreground m-5" />
                  )}
                </div>
                <h3 className="font-bold">{visit.visitor?.name}</h3>
                <p className="text-sm text-muted-foreground">{visit.visitor?.document}</p>
              </div>
              
              <div className="space-y-2 text-sm">
                {visit.visitor?.company && (
                  <div>
                    <p className="font-medium">Empresa</p>
                    <p>{visit.visitor.company}</p>
                  </div>
                )}
                
                {visit.visitor?.email && (
                  <div>
                    <p className="font-medium">Email</p>
                    <p>{visit.visitor.email}</p>
                  </div>
                )}
                
                {visit.visitor?.phone && (
                  <div>
                    <p className="font-medium">Telefone</p>
                    <p>{visit.visitor.phone}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {visit.visitor && visit.room && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <Printer className="h-4 w-4" />
                      Imprimir Crachá
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Crachá de Visitante</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-center py-4">
                      <VisitorBadge 
                        visit={visit}
                        visitor={visit.visitor}
                        room={visit.room}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VisitDetails;
