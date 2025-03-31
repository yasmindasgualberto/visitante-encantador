
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Companion } from '@/types';
import CompanionForm from './CompanionForm';

interface CompanionsListProps {
  companions: Companion[];
  onAddCompanion: (companion: Companion) => void;
  onRemoveCompanion: (index: number) => void;
}

const CompanionsList: React.FC<CompanionsListProps> = ({
  companions,
  onAddCompanion,
  onRemoveCompanion,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Acompanhantes</h3>
        <CompanionForm onAddCompanion={onAddCompanion} />
      </div>

      {companions.length > 0 ? (
        <div className="space-y-2">
          {companions.map((companion, index) => (
            <div 
              key={companion.id} 
              className="flex items-center justify-between p-3 border rounded-md"
            >
              <div>
                <p className="font-medium">{companion.name}</p>
                <p className="text-sm text-muted-foreground">{companion.document}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onRemoveCompanion(index)}
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
  );
};

export default CompanionsList;
