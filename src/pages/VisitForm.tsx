
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Visit, Visitor, Room, Companion } from '@/types';
import { toast } from 'sonner';
import VisitFormContent from '@/components/visit/VisitFormContent';
import VisitSuccess from '@/components/visit/VisitSuccess';
import { getVisitors, getRooms } from '@/services/mockData';
import { createVisit } from '@/services/supabase/visitsService';
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
        
        // Generate a unique badge code
        const code = 'V' + Math.floor(10000 + Math.random() * 90000);
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

  const handleAddCompanion = (companion: Companion) => {
    setCompanions([...companions, companion]);
  };

  const handleRemoveCompanion = (index: number) => {
    setCompanions(companions.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!selectedVisitor) {
      toast.error('Por favor, selecione um visitante');
      return false;
    }
    
    if (!selectedRoom) {
      toast.error('Por favor, selecione uma sala');
      return false;
    }
    
    if (!responsible) {
      toast.error('Por favor, informe o responsável pela visita');
      return false;
    }
    
    if (!badgeCode) {
      toast.error('O código do crachá não pode estar vazio');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (!selectedVisitor || !selectedRoom) {
        throw new Error('Dados incompletos para registro da visita');
      }
      
      // Use the company ID from visitor or room, or default to '1'
      const companyId = selectedVisitor.companyId || selectedRoom.companyId || '1';
      
      // Format companions for the API
      const companionsData = companions.map(companion => ({
        name: companion.name,
        document: companion.document
      }));
      
      console.log('Submitting visit with data:', {
        visitorId: selectedVisitor.id,
        roomId: selectedRoom.id,
        responsible,
        badgeCode,
        companions: companionsData,
        companyId
      });
      
      // Create the visit using Supabase service
      await createVisit(
        selectedVisitor.id,
        selectedRoom.id,
        responsible,
        badgeCode,
        companionsData,
        companyId
      );
      
      toast.success('Visita registrada com sucesso!');
      setShowBadge(true);
    } catch (error) {
      console.error('Erro ao registrar visita:', error);
      toast.error('Erro ao registrar visita. Verifique os dados e tente novamente.');
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
        <VisitSuccess
          visitor={selectedVisitor}
          room={selectedRoom}
          responsible={responsible}
          badgeCode={badgeCode}
          companions={companions}
          onFinish={handleFinishRegistration}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Dados da Visita</CardTitle>
            <CardDescription>
              Os campos marcados com * são obrigatórios.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VisitFormContent
              visitors={visitors}
              rooms={rooms}
              selectedVisitor={selectedVisitor}
              selectedRoom={selectedRoom}
              responsible={responsible}
              badgeCode={badgeCode}
              companions={companions}
              isSubmitting={isSubmitting}
              onSelectVisitor={handleSelectVisitor}
              onSelectRoom={handleSelectRoom}
              onResponsibleChange={setResponsible}
              onBadgeCodeChange={setBadgeCode}
              onAddCompanion={handleAddCompanion}
              onRemoveCompanion={handleRemoveCompanion}
              onSubmit={handleSubmit}
              onCancel={() => navigate('/')}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VisitForm;
