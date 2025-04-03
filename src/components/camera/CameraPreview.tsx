
import React from 'react';

interface CameraPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isRecording: boolean;
}

const CameraPreview: React.FC<CameraPreviewProps> = ({ videoRef, isRecording }) => {
  return (
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
        onPlay={() => console.log('Video started playing')}
      />
    </div>
  );
};

export default CameraPreview;
