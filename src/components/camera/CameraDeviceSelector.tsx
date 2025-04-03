
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CameraDeviceSelectorProps {
  devices: MediaDeviceInfo[];
  selectedDeviceId: string;
  onDeviceChange: (deviceId: string) => void;
}

const CameraDeviceSelector: React.FC<CameraDeviceSelectorProps> = ({
  devices,
  selectedDeviceId,
  onDeviceChange
}) => {
  return (
    <div className="mb-4">
      <Select value={selectedDeviceId} onValueChange={onDeviceChange}>
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
  );
};

export default CameraDeviceSelector;
