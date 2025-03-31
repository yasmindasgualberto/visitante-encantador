
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Companion } from '@/types';

interface CompanionFormProps {
  onAddCompanion: (companion: Companion) => void;
}

const CompanionForm: React.FC<CompanionFormProps> = ({ onAddCompanion }) => {
  const [newCompanion, setNewCompanion] = useState({ name: '', document: '' });
  const [open, setOpen] = useState(false);

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
    
    onAddCompanion(newCompanionWithId);
    setNewCompanion({ name: '', document: '' });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
  );
};

export default CompanionForm;
