
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ClientsHeaderProps {
  onNewClient: () => void;
}

export const ClientsHeader: React.FC<ClientsHeaderProps> = ({ onNewClient }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
        <p className="text-muted-foreground">
          Gerencie os clientes cadastrados no sistema
        </p>
      </div>
      <Button onClick={onNewClient}>
        <Plus className="mr-2 h-4 w-4" />
        Novo Cliente
      </Button>
    </div>
  );
};
