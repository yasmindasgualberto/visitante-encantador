
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Visitor } from '@/types';

interface VisitorSelectorProps {
  visitors: Visitor[];
  selectedVisitor: Visitor | null;
  onSelectVisitor: (visitorId: string) => void;
}

const VisitorSelector: React.FC<VisitorSelectorProps> = ({
  visitors,
  selectedVisitor,
  onSelectVisitor,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-2">
      <Label htmlFor="visitor">Visitante *</Label>
      <Select onValueChange={onSelectVisitor} value={selectedVisitor?.id}>
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
  );
};

export default VisitorSelector;
