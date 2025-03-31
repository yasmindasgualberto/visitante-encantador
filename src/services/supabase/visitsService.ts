
import { supabase } from './baseService';
import { Visit, Companion, Visitor, Room } from '@/types';
import { getVisitorById } from './visitorsService';
import { getRoomById } from './roomsService';

export const getVisits = async (): Promise<Visit[]> => {
  try {
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        visitors(*),
        rooms(*)
      `);
    
    if (error) throw error;
    
    const visits: Visit[] = await Promise.all(data.map(async (visit) => {
      // Fetch companions for each visit
      const { data: companionsData, error: companionsError } = await supabase
        .from('companions')
        .select('*')
        .eq('visit_id', visit.id);
      
      if (companionsError) throw companionsError;
      
      const companions: Companion[] = companionsData.map(companion => ({
        id: companion.id,
        name: companion.name,
        document: companion.document,
        visitId: companion.visit_id
      }));
      
      const visitor = visit.visitors ? {
        id: visit.visitors.id,
        name: visit.visitors.name,
        document: visit.visitors.document,
        photo: visit.visitors.photo,
        phone: visit.visitors.phone,
        email: visit.visitors.email,
        company: visit.visitors.company,
        companyId: visit.visitors.company_id,
        createdAt: new Date(visit.visitors.created_at)
      } : undefined;
      
      const room = visit.rooms ? {
        id: visit.rooms.id,
        name: visit.rooms.name,
        floor: visit.rooms.floor,
        description: visit.rooms.description,
        companyId: visit.rooms.company_id
      } : undefined;
      
      return {
        id: visit.id,
        visitorId: visit.visitor_id,
        visitor,
        roomId: visit.room_id,
        room,
        responsible: visit.responsible,
        badgeCode: visit.badge_code,
        entryTime: new Date(visit.entry_time),
        exitTime: visit.exit_time ? new Date(visit.exit_time) : null,
        companions,
        status: visit.status as 'active' | 'completed' | 'cancelled',
        companyId: visit.company_id
      };
    }));
    
    return visits;
  } catch (error) {
    console.error('Error fetching visits:', error);
    throw error;
  }
};

export const getActiveVisits = async (): Promise<Visit[]> => {
  try {
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        visitors(*),
        rooms(*)
      `)
      .eq('status', 'active');
    
    if (error) throw error;
    
    const visits: Visit[] = await Promise.all(data.map(async (visit) => {
      // Fetch companions for each visit
      const { data: companionsData, error: companionsError } = await supabase
        .from('companions')
        .select('*')
        .eq('visit_id', visit.id);
      
      if (companionsError) throw companionsError;
      
      const companions: Companion[] = companionsData.map(companion => ({
        id: companion.id,
        name: companion.name,
        document: companion.document,
        visitId: companion.visit_id
      }));
      
      const visitor = visit.visitors ? {
        id: visit.visitors.id,
        name: visit.visitors.name,
        document: visit.visitors.document,
        photo: visit.visitors.photo,
        phone: visit.visitors.phone,
        email: visit.visitors.email,
        company: visit.visitors.company,
        companyId: visit.visitors.company_id,
        createdAt: new Date(visit.visitors.created_at)
      } : undefined;
      
      const room = visit.rooms ? {
        id: visit.rooms.id,
        name: visit.rooms.name,
        floor: visit.rooms.floor,
        description: visit.rooms.description,
        companyId: visit.rooms.company_id
      } : undefined;
      
      return {
        id: visit.id,
        visitorId: visit.visitor_id,
        visitor,
        roomId: visit.room_id,
        room,
        responsible: visit.responsible,
        badgeCode: visit.badge_code,
        entryTime: new Date(visit.entry_time),
        exitTime: visit.exit_time ? new Date(visit.exit_time) : null,
        companions,
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

export const getVisitById = async (id: string): Promise<Visit> => {
  try {
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        visitors(*),
        rooms(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Fetch companions for the visit
    const { data: companionsData, error: companionsError } = await supabase
      .from('companions')
      .select('*')
      .eq('visit_id', id);
    
    if (companionsError) throw companionsError;
    
    const companions: Companion[] = companionsData.map(companion => ({
      id: companion.id,
      name: companion.name,
      document: companion.document,
      visitId: companion.visit_id
    }));
    
    const visitor = data.visitors ? {
      id: data.visitors.id,
      name: data.visitors.name,
      document: data.visitors.document,
      photo: data.visitors.photo,
      phone: data.visitors.phone,
      email: data.visitors.email,
      company: data.visitors.company,
      companyId: data.visitors.company_id,
      createdAt: new Date(data.visitors.created_at)
    } : undefined;
    
    const room = data.rooms ? {
      id: data.rooms.id,
      name: data.rooms.name,
      floor: data.rooms.floor,
      description: data.rooms.description,
      companyId: data.rooms.company_id
    } : undefined;
    
    return {
      id: data.id,
      visitorId: data.visitor_id,
      visitor,
      roomId: data.room_id,
      room,
      responsible: data.responsible,
      badgeCode: data.badge_code,
      entryTime: new Date(data.entry_time),
      exitTime: data.exit_time ? new Date(data.exit_time) : null,
      companions,
      status: data.status as 'active' | 'completed' | 'cancelled',
      companyId: data.company_id
    };
  } catch (error) {
    console.error('Error fetching visit:', error);
    throw error;
  }
};

export const createVisit = async (
  visitorId: string,
  roomId: string,
  responsible: string,
  badgeCode: string,
  companions: Omit<Companion, 'id' | 'visitId'>[],
  companyId: string = '00000000-0000-0000-0000-000000000000' // Default value for testing
): Promise<string> => {
  try {
    // Start a transaction
    const { data: visitData, error: visitError } = await supabase
      .from('visits')
      .insert({
        visitor_id: visitorId,
        room_id: roomId,
        responsible,
        badge_code: badgeCode,
        status: 'active',
        company_id: companyId
      })
      .select()
      .single();
    
    if (visitError) throw visitError;
    
    // Add companions if any
    if (companions.length > 0) {
      const companionsToInsert = companions.map(companion => ({
        name: companion.name,
        document: companion.document,
        visit_id: visitData.id
      }));
      
      const { error: companionsError } = await supabase
        .from('companions')
        .insert(companionsToInsert);
      
      if (companionsError) throw companionsError;
    }
    
    // Create badge
    const { error: badgeError } = await supabase
      .from('badges')
      .insert({
        code: badgeCode,
        visit_id: visitData.id,
        is_active: true
      });
    
    if (badgeError) throw badgeError;
    
    return visitData.id;
  } catch (error) {
    console.error('Error creating visit:', error);
    throw error;
  }
};

export const checkoutVisit = async (id: string): Promise<void> => {
  try {
    // Update visit status and exit time
    const { error: visitError } = await supabase
      .from('visits')
      .update({
        status: 'completed',
        exit_time: new Date().toISOString()
      })
      .eq('id', id);
    
    if (visitError) throw visitError;
    
    // Deactivate badge
    const { error: badgeError } = await supabase
      .from('badges')
      .update({ is_active: false })
      .eq('visit_id', id);
    
    if (badgeError) throw badgeError;
  } catch (error) {
    console.error('Error checking out visit:', error);
    throw error;
  }
};
