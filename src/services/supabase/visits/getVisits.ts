
import { supabase } from '../baseService';
import { Visit } from '@/types';
import { VisitWithRaw } from './types';

/**
 * Retrieves all visits from the database
 * @returns Promise<Visit[]> Array of visits with related data
 */
export const getVisits = async (): Promise<Visit[]> => {
  try {
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        rooms:room_id (*),
        visitors:visitor_id (*)
      `);
    
    if (error) throw error;
    
    return data.map((visit: any) => ({
      id: visit.id,
      visitorId: visit.visitor_id,
      visitor: visit.visitors ? {
        id: visit.visitors.id,
        name: visit.visitors.name,
        document: visit.visitors.document,
        photo: visit.visitors.photo,
        phone: visit.visitors.phone,
        email: visit.visitors.email,
        company: visit.visitors.company,
        createdAt: new Date(visit.visitors.created_at)
      } : undefined,
      roomId: visit.room_id,
      room: visit.rooms ? {
        id: visit.rooms.id,
        name: visit.rooms.name,
        floor: visit.rooms.floor,
        description: visit.rooms.description
      } : undefined,
      responsible: visit.responsible,
      badgeCode: visit.badge_code,
      entryTime: new Date(visit.entry_time),
      exitTime: visit.exit_time ? new Date(visit.exit_time) : null,
      companions: [],  // Will be populated separately
      status: visit.status as 'active' | 'completed' | 'cancelled',
      companyId: visit.company_id
    }));
  } catch (error) {
    console.error('Error fetching visits:', error);
    throw error;
  }
};
