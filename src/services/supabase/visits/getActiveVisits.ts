
import { supabase } from '../baseService';
import { Visit } from '@/types';
import { VisitCompanionRaw } from './types';

/**
 * Retrieves all active visits (with no exit time) from the database
 * @returns Promise<Visit[]> Array of active visits with related data
 */
export const getActiveVisits = async (): Promise<Visit[]> => {
  try {
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        rooms:room_id (*),
        visitors:visitor_id (*)
      `)
      .is('exit_time', null)
      .eq('status', 'active');
    
    if (error) throw error;
    
    const visits = await Promise.all(data.map(async (visit: any) => {
      // Get companions for each visit
      const { data: companions, error: companionsError } = await supabase
        .from('companions')
        .select('*')
        .eq('visit_id', visit.id);
      
      if (companionsError) throw companionsError;
      
      return {
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
        companions: companions?.map((companion: VisitCompanionRaw) => ({
          id: companion.id,
          name: companion.name,
          document: companion.document,
          visitId: companion.visit_id
        })) || [],
        status: visit.status as 'active' | 'completed' | 'cancelled',
        companyId: visit.company_id
      };
    }));
    
    return visits;
  } catch (error) {
    console.error('Error fetching active visits:', error);
    throw error;
  }
};
