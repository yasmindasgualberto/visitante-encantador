
import React, { useEffect, useState } from 'react';
import { generateQRCode } from '@/utils/qrcode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Visitor, Visit, Room } from '@/types';

interface VisitorBadgeProps {
  visit: Visit;
  visitor: Visitor;
  room: Room;
}

const VisitorBadge: React.FC<VisitorBadgeProps> = ({ visit, visitor, room }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    const generateQRCodeUrl = async () => {
      try {
        const url = await generateQRCode(visit.badgeCode);
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCodeUrl();
  }, [visit.badgeCode]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Card className="w-[340px] bg-white card-shadow hover-scale border-t-4 border-t-primary">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-center text-primary">
          Crachá de Visitante
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm font-semibold">Nome:</p>
            <p className="text-base">{visitor.name}</p>
            
            <p className="text-sm font-semibold mt-2">Documento:</p>
            <p className="text-base">{visitor.document}</p>
            
            <p className="text-sm font-semibold mt-2">Data:</p>
            <p className="text-base">{formatDate(visit.entryTime)}</p>
            
            <p className="text-sm font-semibold mt-2">Local:</p>
            <p className="text-base">{room.name} - {room.floor}</p>
          </div>
          
          {visitor.photo ? (
            <div className="w-24 h-24 border border-gray-200 rounded-lg overflow-hidden">
              <img 
                src={visitor.photo} 
                alt={`Foto de ${visitor.name}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 border border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
              <p className="text-gray-400 text-xs text-center">Sem foto</p>
            </div>
          )}
        </div>
        
        <div className="pt-2 border-t border-gray-100">
          <div className="flex flex-col items-center justify-center">
            {qrCodeUrl ? (
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                className="w-32 h-32 object-contain"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
                <p className="text-gray-400 text-xs">Carregando QR Code...</p>
              </div>
            )}
            <p className="text-center font-mono text-sm mt-1">{visit.badgeCode}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisitorBadge;
