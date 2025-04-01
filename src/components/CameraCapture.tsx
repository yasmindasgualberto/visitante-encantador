
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CameraCaptureProps {
  onCapture: (image: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  // Fetch available video devices
  const getVideoDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
      
      // Set default device if available
      if (videoDevices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error('Erro ao buscar dispositivos:', err);
      setError('Não foi possível listar os dispositivos de câmera disponíveis.');
    }
  }, [selectedDeviceId]);

  const startCamera = useCallback(async () => {
    // Stop any existing stream first
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: selectedDeviceId 
          ? {
              deviceId: { exact: selectedDeviceId },
              width: { ideal: 640 },
              height: { ideal: 480 }
            }
          : {
              width: { ideal: 640 },
              height: { ideal: 480 },
              facingMode: 'user'
            } 
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsRecording(true);
        setError(null);
      }
    } catch (err) {
      console.error('Erro ao acessar a câmera:', err);
      setError('Não foi possível acessar a câmera. Verifique as permissões do navegador.');
      setIsRecording(false);
    }
  }, [selectedDeviceId]);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsRecording(false);
    }
  }, []);

  const takePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const photoData = canvas.toDataURL('image/png');
        onCapture(photoData);
        stopCamera();
      }
    }
  }, [onCapture, stopCamera]);

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
  };

  // Initialize camera when component mounts or selected device changes
  useEffect(() => {
    getVideoDevices();
    
    // Request permissions and list devices when component mounts
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => getVideoDevices())
      .catch(err => {
        console.error('Error getting permission:', err);
        setError('Permissão de câmera negada. Por favor, permita o acesso à câmera.');
      });
      
    return () => {
      stopCamera();
    };
  }, [getVideoDevices, stopCamera]);

  // Start camera when device is selected
  useEffect(() => {
    if (selectedDeviceId) {
      startCamera();
    }
  }, [selectedDeviceId, startCamera]);

  if (error) {
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
          <Button variant="outline" onClick={() => startCamera()} className="flex-1">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Fechar
          </Button>
        </div>
      </div>
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
      
      {devices.length > 1 && (
        <div className="mb-4">
          <Select value={selectedDeviceId} onValueChange={handleDeviceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar câmera" />
            </SelectTrigger>
            <SelectContent>
              {devices.map((device) => (
                <SelectItem key={device.deviceId} value={device.deviceId}>
                  {device.label || `Câmera ${devices.indexOf(device) + 1}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="relative mb-4 bg-black rounded-lg overflow-hidden h-80 flex items-center justify-center">
        {!isRecording && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <p className="text-white">Inicializando câmera...</p>
          </div>
        )}
        <video 
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-contain"
          onPlay={() => setIsRecording(true)}
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      <div className="flex gap-2">
        <Button 
          disabled={!isRecording} 
          onClick={takePhoto}
          className="flex items-center gap-2 flex-1"
        >
          <Camera className="h-4 w-4" />
          Capturar Foto
        </Button>
        
        <Button 
          variant="outline" 
          onClick={startCamera}
          className="flex items-center gap-2"
          title="Reiniciar câmera"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CameraCapture;
