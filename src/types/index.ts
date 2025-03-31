
export interface Visitor {
  id: string;
  name: string;
  document: string;
  photo: string | null;
  phone: string;
  email: string;
  company?: string;
  createdAt: Date;
  companyId?: string; // Adicionado para vincular visitante a uma empresa
}

export interface Room {
  id: string;
  name: string;
  floor: string;
  description?: string;
  companyId?: string; // Adicionado para vincular sala a uma empresa
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
  companyId: string; // Adicionado para vincular visita a uma empresa
}

export interface Badge {
  id: string;
  code: string;
  visitId: string;
  isActive: boolean;
}

export interface Company {
  id: string;
  companyName: string;
  responsibleName: string;
  email: string;
  password: string;
  plan: 'basic' | 'professional' | 'enterprise';
  status: 'active' | 'blocked' | 'pending';
  createdAt: string;
}

export interface VisitReport {
  daily: VisitsByRoom[];
  weekly: VisitsByRoom[];
  monthly: VisitsByRoom[];
}

export interface VisitsByRoom {
  roomId: string;
  roomName: string;
  count: number;
}
