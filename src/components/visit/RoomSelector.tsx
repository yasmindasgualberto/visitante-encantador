
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Room } from '@/types';

interface RoomSelectorProps {
  rooms: Room[];
  selectedRoom: Room | null;
  onSelectRoom: (roomId: string) => void;
}

const RoomSelector: React.FC<RoomSelectorProps> = ({
  rooms,
  selectedRoom,
  onSelectRoom,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="room">Local/Sala *</Label>
      <Select onValueChange={onSelectRoom} value={selectedRoom?.id}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma sala" />
        </SelectTrigger>
        <SelectContent>
          {rooms.map((room) => (
            <SelectItem key={room.id} value={room.id}>
              {room.name} - {room.floor}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RoomSelector;
