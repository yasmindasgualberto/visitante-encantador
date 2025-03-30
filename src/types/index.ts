
export interface Visitor {
  id: string;
  name: string;
  document: string;
  photo: string | null;
  phone: string;
  email: string;
  company?: string;
  createdAt: Date;
}

export interface Room {
  id: string;
  name: string;
  floor: string;
  description?: string;
}

export interface Companion {
  id: string;
  name: string;
  document: string;
  visitId: string;
}

export interface Visit {
  id: string;
  visitorId: string;
  visitor?: Visitor;
  roomId: string;
  room?: Room;
  responsible: string;
  badgeCode: string;
  entryTime: Date;
  exitTime: Date | null;
  companions: Companion[];
  status: 'active' | 'completed' | 'cancelled';
}

export interface Badge {
  id: string;
  code: string;
  visitId: string;
  isActive: boolean;
}
