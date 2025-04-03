
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RefreshCw } from 'lucide-react';

interface CameraControlsProps {
  isRecording: boolean;
  onCapture: () => void;
  onRestart: () => void;
}

const CameraControls: React.FC<CameraControlsProps> = ({
  isRecording,
  onCapture,
  onRestart
}) => {
  return (
    <div className="flex gap-2">
      <Button 
        disabled={!isRecording} 
        onClick={onCapture}
        className="flex items-center gap-2 flex-1"
      >
        <Camera className="h-4 w-4" />
        Capturar Foto
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onRestart}
        className="flex items-center gap-2"
        title="Reiniciar câmera"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CameraControls;
