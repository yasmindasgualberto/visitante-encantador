import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { X, Plus, UserCheck, Save, ArrowLeft } from 'lucide-react';
import VisitorBadge from '@/components/VisitorBadge';
import { getVisitors, getRooms, generateBadgeCode, addVisit } from '@/services/mockData';
import { Visit, Visitor, Room, Companion } from '@/types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

const VisitForm = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [responsible, setResponsible] = useState('');
  const [badgeCode, setBadgeCode] = useState('');
  const [newCompanion, setNewCompanion] = useState({ name: '', document: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const visitorsData = await getVisitors();
        const roomsData = await getRooms();
        
        setVisitors(visitorsData);
        setRooms(roomsData);
        
        const code = generateBadgeCode();
        setBadgeCode(code);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados necessários');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSelectVisitor = (visitorId: string) => {
    const visitor = visitors.find(v => v.id === visitorId);
    setSelectedVisitor(visitor || null);
  };

  const handleSelectRoom = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    setSelectedRoom(room || null);
  };

  const handleAddCompanion = () => {
    if (!newCompanion.name || !newCompanion.document) {
      toast.error('Preencha o nome e documento do acompanhante');
      return;
    }
    
    const newCompanionWithId: Companion = {
      id: uuidv4(),
      visitId: 'temp-' + uuidv4(),
      ...newCompanion
    };
    
    setCompanions([...companions, newCompanionWithId]);
    setNewCompanion({ name: '', document: '' });
  };

  const handleRemoveCompanion = (index: number) => {
    setCompanions(companions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedVisitor || !selectedRoom || !responsible) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const visitData: Omit<Visit, 'id' | 'status'> = {
        visitorId: selectedVisitor.id,
        visitor: selectedVisitor,
        roomId: selectedRoom.id,
        room: selectedRoom,
        responsible,
        badgeCode,
        entryTime: new Date(),
        exitTime: null,
        companions,
      };
      
      await addVisit(visitData);
      toast.success('Visita registrada com sucesso!');
      setShowBadge(true);
    } catch (error) {
      console.error('Erro ao registrar visita:', error);
      toast.error('Erro ao registrar visita');
      setIsSubmitting(false);
    }
  };

  const handleFinishRegistration = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-enter">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Registrar Nova Visita</h1>
        <p className="text-muted-foreground">
          Preencha os dados para registrar uma nova entrada no sistema.
        </p>
      </div>

      {showBadge && selectedVisitor && selectedRoom ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visita Registrada com Sucesso!</CardTitle>
              <CardDescription>
                A visita foi registrada no sistema. Você pode imprimir o crachá do visitante.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <VisitorBadge 
                visit={{
                  id: '0',
                  visitorId: selectedVisitor.id,
                  roomId: selectedRoom.id,
                  responsible,
                  badgeCode,
                  entryTime: new Date(),
                  exitTime: null,
                  companions,
                  status: 'active'
                }}
                visitor={selectedVisitor}
                room={selectedRoom}
              />
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={handleFinishRegistration}>
                Concluir
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Dados da Visita</CardTitle>
              <CardDescription>
                Os campos marcados com * são obrigatórios.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="visitor">Visitante *</Label>
                  <Select onValueChange={handleSelectVisitor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um visitante" />
                    </SelectTrigger>
                    <SelectContent>
                      {visitors.map((visitor) => (
                        <SelectItem key={visitor.id} value={visitor.id}>
                          {visitor.name} ({visitor.document})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="text-sm mt-1">
                    <Button 
                      variant="link" 
                      className="p-0 h-auto" 
                      onClick={() => navigate('/visitantes/novo')}
                    >
                      Cadastrar novo visitante
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="room">Local/Sala *</Label>
                  <Select onValueChange={handleSelectRoom}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma sala" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name} - {room.floor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsible">Responsável pela visita *</Label>
                  <Input
                    id="responsible"
                    value={responsible}
                    onChange={(e) => setResponsible(e.target.value)}
                    placeholder="Nome da pessoa que irá receber o visitante"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="badgeCode">Código do Crachá</Label>
                  <Input
                    id="badgeCode"
                    value={badgeCode}
                    onChange={(e) => setBadgeCode(e.target.value)}
                    placeholder="Código único do crachá"
                    required
                  />
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Acompanhantes</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Adicionar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Acompanhante</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="companionName">Nome Completo</Label>
                          <Input
                            id="companionName"
                            value={newCompanion.name}
                            onChange={(e) => setNewCompanion({...newCompanion, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="companionDocument">Documento (CPF/RG)</Label>
                          <Input
                            id="companionDocument"
                            value={newCompanion.document}
                            onChange={(e) => setNewCompanion({...newCompanion, document: e.target.value})}
                          />
                        </div>
                        <Button 
                          onClick={handleAddCompanion} 
                          className="w-full mt-2 flex items-center gap-2"
                        >
                          <UserCheck className="h-4 w-4" />
                          Adicionar Acompanhante
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {companions.length > 0 ? (
                  <div className="space-y-2">
                    {companions.map((companion, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-3 border rounded-md"
                      >
                        <div>
                          <p className="font-medium">{companion.name}</p>
                          <p className="text-sm text-muted-foreground">{companion.document}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoveCompanion(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 border rounded-md text-muted-foreground">
                    Nenhum acompanhante adicionado.
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !selectedVisitor || !selectedRoom || !responsible}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Registrar Entrada
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
};

export default VisitForm;
