
import { supabase } from '../baseService';
import { Visit, Companion } from '@/types';
import { CreateVisitParams } from './types';

/**
 * Creates a new visit record with companions and badge
 * @param params Visit creation parameters
 * @returns Promise<Visit> The newly created visit with all related data
 */
export const createVisit = async ({
  visitorId,
  roomId,
  responsible,
  badgeCode,
  companions,
  companyId
}: CreateVisitParams): Promise<Visit> => {
  try {
    console.log('Creating visit with data:', { visitorId, roomId, responsible, badgeCode, companions, companyId });
    
    // Validate required fields
    if (!visitorId || !roomId || !responsible || !badgeCode || !companyId) {
      throw new Error('Missing required fields for visit creation');
    }
    
    // Insert visit
    const { data, error } = await supabase
      .from('visits')
      .insert({
        visitor_id: visitorId,
        room_id: roomId,
        responsible: responsible,
        badge_code: badgeCode,
        status: 'active',
        company_id: companyId
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error inserting visit:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('Failed to create visit record');
    }
    
    console.log('Visit created successfully:', data);
    
    // Insert companions if any
    if (companions && companions.length > 0) {
      const companionsToInsert = companions.map(companion => ({
        name: companion.name,
        document: companion.document,
        visit_id: data.id
      }));
      
      console.log('Inserting companions:', companionsToInsert);
      
      const { error: companionsError } = await supabase
        .from('companions')
        .insert(companionsToInsert);
      
      if (companionsError) {
        console.error('Error inserting companions:', companionsError);
        throw companionsError;
      }
    }
    
    // Insert badge
    console.log('Inserting badge with code:', badgeCode);
    
    const { error: badgeError } = await supabase
      .from('badges')
      .insert({
        code: badgeCode,
        visit_id: data.id,
        is_active: true
      });
    
    if (badgeError) {
      console.error('Error inserting badge:', badgeError);
      throw badgeError;
    }
    
    // Get visitor and room data for the response
    console.log('Fetching visitor data for ID:', visitorId);
    
    const { data: visitor, error: visitorError } = await supabase
      .from('visitors')
      .select('*')
      .eq('id', visitorId)
      .maybeSingle();
    
    if (visitorError) {
      console.error('Error fetching visitor:', visitorError);
      throw visitorError;
    }
    
    if (!visitor) {
      console.error('Visitor not found for ID:', visitorId);
      throw new Error('Visitor not found');
    }
    
    console.log('Fetching room data for ID:', roomId);
    
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .maybeSingle();
    
    if (roomError) {
      console.error('Error fetching room:', roomError);
      throw roomError;
    }
    
    if (!room) {
      console.error('Room not found for ID:', roomId);
      throw new Error('Room not found');
    }
    
    console.log('Visit creation completed successfully');
    
    return {
      id: data.id,
      visitorId: data.visitor_id,
      visitor: {
        id: visitor.id,
        name: visitor.name,
        document: visitor.document,
        photo: visitor.photo,
        phone: visitor.phone,
        email: visitor.email,
        company: visitor.company,
        createdAt: new Date(visitor.created_at),
        companyId: visitor.company_id
      },
      roomId: data.room_id,
      room: {
        id: room.id,
        name: room.name,
        floor: room.floor,
        description: room.description,
        companyId: room.company_id
      },
      responsible: data.responsible,
      badgeCode: data.badge_code,
      entryTime: new Date(data.entry_time),
      exitTime: null,
      companions: companions.map((companion, index) => ({
        id: `temp-${index}`, // Temporary ID as we don't have the real IDs yet
        name: companion.name,
        document: companion.document,
        visitId: data.id
      })),
      status: data.status as 'active' | 'completed' | 'cancelled',
      companyId: data.company_id
    };
  } catch (error) {
    console.error('Error creating visit:', error);
    throw error;
  }
};
