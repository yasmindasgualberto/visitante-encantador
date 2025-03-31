
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

interface ClientsSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const ClientsSearch: React.FC<ClientsSearchProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar cliente..."
          className="pl-8 w-[250px]"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button variant="outline" size="icon">
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  );
};
