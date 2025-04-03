
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface VisitorFormHeaderProps {
  title: string;
  description: string;
}

const VisitorFormHeader: React.FC<VisitorFormHeaderProps> = ({ title, description }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/visitantes')} 
        className="flex items-center gap-2 mb-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground">
        {description}
      </p>
    </div>
  );
};

export default VisitorFormHeader;
