
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';
import CameraDeviceSelector from '@/components/camera/CameraDeviceSelector';
import CameraError from '@/components/camera/CameraError';
import CameraPreview from '@/components/camera/CameraPreview';
import CameraControls from '@/components/camera/CameraControls';

interface CameraCaptureProps {
  onCapture: (image: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const {
    videoRef,
    isRecording,
    error,
    devices,
    selectedDeviceId,
    startCamera,
    takePhoto,
    handleDeviceChange,
  } = useCamera({ onCapture });

  const handleClose = () => {
    onClose();
  };

  if (error) {
    return (
      <CameraError 
        error={error} 
        onRetry={startCamera} 
        onClose={onClose} 
      />
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Capturar Foto</h3>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <CameraDeviceSelector 
        devices={devices}
        selectedDeviceId={selectedDeviceId}
        onDeviceChange={handleDeviceChange}
      />
      
      <CameraPreview 
        videoRef={videoRef}
        isRecording={isRecording}
      />
      
      <canvas ref={canvasRef} className="hidden" />
      
      <CameraControls 
        isRecording={isRecording}
        onCapture={takePhoto}
        onRestart={startCamera}
      />
    </div>
  );
};

export default CameraCapture;
