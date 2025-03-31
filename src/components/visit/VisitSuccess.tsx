
import React from 'react';
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import VisitorBadge from '@/components/VisitorBadge';
import { Visit, Visitor, Room, Companion } from '@/types';

interface VisitSuccessProps {
  visitor: Visitor;
  room: Room;
  responsible: string;
  badgeCode: string;
  companions: Companion[];
  onFinish: () => void;
}

const VisitSuccess: React.FC<VisitSuccessProps> = ({
  visitor,
  room,
  responsible,
  badgeCode,
  companions,
  onFinish,
}) => {
  const visit: Visit = {
    id: '0',
    visitorId: visitor.id,
    roomId: room.id,
    responsible,
    badgeCode,
    entryTime: new Date(),
    exitTime: null,
    companions,
    status: 'active',
    companyId: visitor.companyId || room.companyId || '1' // Use visitor's companyId, room's companyId, or default to '1'
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Visita Registrada com Sucesso!</CardTitle>
          <CardDescription>
            A visita foi registrada no sistema. Você pode imprimir o crachá do visitante.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <VisitorBadge 
            visit={visit}
            visitor={visitor}
            room={room}
          />
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={onFinish}>
            Concluir
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VisitSuccess;
