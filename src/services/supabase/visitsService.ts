
import { supabase } from './baseService';
import { Visit, Companion, Room, Visitor } from '@/types';

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
    
    return data.map(visit => ({
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
      companions: companions?.map(companion => ({
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
    
    const visits = await Promise.all(data.map(async (visit) => {
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
        companions: companions?.map(companion => ({
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

export const checkoutVisit = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('visits')
      .update({
        exit_time: new Date().toISOString(),
        status: 'completed'
      })
      .eq('id', id);
    
    if (error) throw error;
    
    // Also update any badges associated with this visit
    const { error: badgeError } = await supabase
      .from('badges')
      .update({
        is_active: false
      })
      .eq('visit_id', id);
    
    if (badgeError) throw badgeError;
  } catch (error) {
    console.error('Error checking out visit:', error);
    throw error;
  }
};

export const createVisit = async (
  visitorId: string, 
  roomId: string, 
  responsible: string, 
  badgeCode: string,
  companions: Omit<Companion, 'id' | 'visitId'>[],
  companyId: string
): Promise<Visit> => {
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
