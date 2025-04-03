
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseCameraOptions {
  onCapture?: (photoData: string) => void;
}

export const useCamera = ({ onCapture }: UseCameraOptions = {}) => {
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
      console.log('Available video devices:', videoDevices);
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
      console.log('Starting camera with device ID:', selectedDeviceId);
      
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
      
      console.log('Using constraints:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera stream obtained successfully');
      
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
    if (videoRef.current && canvasRef.current && onCapture) {
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

  const handleDeviceChange = (deviceId: string) => {
    console.log('Selected device changed to:', deviceId);
    setSelectedDeviceId(deviceId);
  };

  // Initialize camera when component mounts
  useEffect(() => {
    console.log('useCamera hook initialized');
    
    // Request permissions and list devices when hook is initialized
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        console.log('Camera permission granted');
        getVideoDevices();
      })
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
      console.log('Selected device ID changed, starting camera');
      startCamera();
    }
  }, [selectedDeviceId, startCamera]);

  return {
    videoRef,
    canvasRef,
    isRecording,
    error,
    devices,
    selectedDeviceId,
    startCamera,
    stopCamera,
    takePhoto,
    handleDeviceChange,
  };
};
