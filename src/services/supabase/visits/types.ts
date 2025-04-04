
// Internal types used by the visits service
import { Visit, Companion, Room, Visitor } from '@/types';

// Helper types for internal service operations
export interface VisitWithRaw {
  id: string;
  visitor_id: string;
  visitors?: any;
  room_id: string;
  rooms?: any;
  responsible: string;
  badge_code: string;
  entry_time: string;
  exit_time: string | null;
  status: string; // Changed from 'active' | 'completed' | 'cancelled' to string
  company_id: string;
}

export interface VisitCompanionRaw {
  id: string;
  name: string;
  document: string;
  visit_id: string;
}

export interface CreateVisitParams {
  visitorId: string;
  roomId: string;
  responsible: string;
  badgeCode: string;
  companions: Omit<Companion, 'id' | 'visitId'>[];
  companyId: string;
}
