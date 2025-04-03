
import { supabase } from '../baseService';
import { Visit } from '@/types';
import { VisitWithRaw, VisitCompanionRaw } from './types';

/**
 * Retrieves a specific visit by ID with all related data
 * @param id The visit ID to retrieve
 * @returns Promise<Visit> Visit with all related data
 */
export const getVisitById = async (id: string): Promise<Visit> => {
  try {
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        rooms:room_id (*),
        visitors:visitor_id (*)
      `)
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Visit not found');
    
    // Get companions
    const { data: companions, error: companionsError } = await supabase
      .from('companions')
      .select('*')
      .eq('visit_id', id);
    
    if (companionsError) throw companionsError;
    
    return {
      id: data.id,
      visitorId: data.visitor_id,
      visitor: data.visitors ? {
        id: data.visitors.id,
        name: data.visitors.name,
        document: data.visitors.document,
        photo: data.visitors.photo,
        phone: data.visitors.phone,
        email: data.visitors.email,
        company: data.visitors.company,
        createdAt: new Date(data.visitors.created_at)
      } : undefined,
      roomId: data.room_id,
      room: data.rooms ? {
        id: data.rooms.id,
        name: data.rooms.name,
        floor: data.rooms.floor,
        description: data.rooms.description
      } : undefined,
      responsible: data.responsible,
      badgeCode: data.badge_code,
      entryTime: new Date(data.entry_time),
      exitTime: data.exit_time ? new Date(data.exit_time) : null,
      companions: companions?.map((companion: VisitCompanionRaw) => ({
        id: companion.id,
        name: companion.name,
        document: companion.document,
        visitId: companion.visit_id
      })) || [],
      status: data.status as 'active' | 'completed' | 'cancelled',
      companyId: data.company_id
    };
  } catch (error) {
    console.error('Error fetching visit:', error);
    throw error;
  }
};
