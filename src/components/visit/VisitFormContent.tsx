
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Save } from 'lucide-react';
import VisitorSelector from './VisitorSelector';
import RoomSelector from './RoomSelector';
import CompanionsList from './CompanionsList';
import { Visitor, Room, Companion } from '@/types';

interface VisitFormContentProps {
  visitors: Visitor[];
  rooms: Room[];
  selectedVisitor: Visitor | null;
  selectedRoom: Room | null;
  responsible: string;
  badgeCode: string;
  companions: Companion[];
  isSubmitting: boolean;
  onSelectVisitor: (visitorId: string) => void;
  onSelectRoom: (roomId: string) => void;
  onResponsibleChange: (value: string) => void;
  onBadgeCodeChange: (value: string) => void;
  onAddCompanion: (companion: Companion) => void;
  onRemoveCompanion: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const VisitFormContent: React.FC<VisitFormContentProps> = ({
  visitors,
  rooms,
  selectedVisitor,
  selectedRoom,
  responsible,
  badgeCode,
  companions,
  isSubmitting,
  onSelectVisitor,
  onSelectRoom,
  onResponsibleChange,
  onBadgeCodeChange,
  onAddCompanion,
  onRemoveCompanion,
  onSubmit,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-6">
        <div className="space-y-4">
          <VisitorSelector 
            visitors={visitors} 
            selectedVisitor={selectedVisitor} 
            onSelectVisitor={onSelectVisitor} 
          />

          <RoomSelector 
            rooms={rooms} 
            selectedRoom={selectedRoom} 
            onSelectRoom={onSelectRoom} 
          />

          <div className="space-y-2">
            <Label htmlFor="responsible">Responsável pela visita *</Label>
            <Input
              id="responsible"
              value={responsible}
              onChange={(e) => onResponsibleChange(e.target.value)}
              placeholder="Nome da pessoa que irá receber o visitante"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="badgeCode">Código do Crachá</Label>
            <Input
              id="badgeCode"
              value={badgeCode}
              onChange={(e) => onBadgeCodeChange(e.target.value)}
              placeholder="Código único do crachá"
              required
            />
          </div>
        </div>

        <Separator />

        <CompanionsList 
          companions={companions}
          onAddCompanion={onAddCompanion}
          onRemoveCompanion={onRemoveCompanion}
        />
      </div>

      <div className="flex justify-between mt-6 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
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
      </div>
    </form>
  );
};

export default VisitFormContent;
