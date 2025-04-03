
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, X } from 'lucide-react';

interface CameraErrorProps {
  error: string;
  onRetry: () => void;
  onClose: () => void;
}

const CameraError: React.FC<CameraErrorProps> = ({ error, onRetry, onClose }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Capturar Foto</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-4">
        {error}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onRetry} className="flex-1">
          <RefreshCw className="h-4 w-4 mr-2" />
          Tentar novamente
        </Button>
        <Button variant="outline" onClick={onClose} className="flex-1">
          Fechar
        </Button>
      </div>
    </div>
  );
};

export default CameraError;
