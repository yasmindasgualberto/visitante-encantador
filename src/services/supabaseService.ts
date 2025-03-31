
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { 
  Visitor, 
  Room, 
  Visit, 
  Companion, 
  Company,
  VisitReport,
  VisitsByRoom,
  Badge
} from '@/types';

// Companies
export const getCompanies = async (): Promise<Company[]> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*');
    
    if (error) throw error;
    
    return data.map(company => ({
      id: company.id,
      companyName: company.company_name,
      responsibleName: company.responsible_name,
      email: company.email,
      password: company.password,
      plan: company.plan as 'basic' | 'professional' | 'enterprise',
      status: company.status as 'active' | 'blocked' | 'pending',
      createdAt: new Date(company.created_at).toLocaleDateString('pt-BR')
    }));
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

export const createCompany = async (company: Omit<Company, 'id' | 'createdAt'>): Promise<Company> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .insert({
        company_name: company.companyName,
        responsible_name: company.responsibleName,
        email: company.email,
        password: company.password,
        plan: company.plan,
        status: company.status
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      companyName: data.company_name,
      responsibleName: data.responsible_name,
      email: data.email,
      password: data.password,
      plan: data.plan as 'basic' | 'professional' | 'enterprise',
      status: data.status as 'active' | 'blocked' | 'pending',
      createdAt: new Date(data.created_at).toLocaleDateString('pt-BR')
    };
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
};

export const updateCompany = async (id: string, company: Partial<Omit<Company, 'id' | 'createdAt'>>): Promise<void> => {
  try {
    const updateData: Record<string, any> = {};
    
    if (company.companyName) updateData.company_name = company.companyName;
    if (company.responsibleName) updateData.responsible_name = company.responsibleName;
    if (company.email) updateData.email = company.email;
    if (company.password) updateData.password = company.password;
    if (company.plan) updateData.plan = company.plan;
    if (company.status) updateData.status = company.status;
    
    const { error } = await supabase
      .from('companies')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error updating company:', error);
    throw error;
  }
};

export const deleteCompany = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting company:', error);
    throw error;
  }
};

// Visitors
export const getVisitors = async (): Promise<Visitor[]> => {
  try {
    const { data, error } = await supabase
      .from('visitors')
      .select('*');
    
    if (error) throw error;
    
    return data.map(visitor => ({
      id: visitor.id,
      name: visitor.name,
      document: visitor.document,
      photo: visitor.photo,
      phone: visitor.phone,
      email: visitor.email,
      company: visitor.company,
      companyId: visitor.company_id,
      createdAt: new Date(visitor.created_at)
    }));
  } catch (error) {
    console.error('Error fetching visitors:', error);
    throw error;
  }
};

export const getVisitorById = async (id: string): Promise<Visitor> => {
  try {
    const { data, error } = await supabase
      .from('visitors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      document: data.document,
      photo: data.photo,
      phone: data.phone,
      email: data.email,
      company: data.company,
      companyId: data.company_id,
      createdAt: new Date(data.created_at)
    };
  } catch (error) {
    console.error('Error fetching visitor:', error);
    throw error;
  }
};

// Rooms
export const getRooms = async (): Promise<Room[]> => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*');
    
    if (error) throw error;
    
    return data.map(room => ({
      id: room.id,
      name: room.name,
      floor: room.floor,
      description: room.description,
      companyId: room.company_id
    }));
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
};

export const getRoomById = async (id: string): Promise<Room> => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      floor: data.floor,
      description: data.description,
      companyId: data.company_id
    };
  } catch (error) {
    console.error('Error fetching room:', error);
    throw error;
  }
};

// Visits
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

// Reports
export const getVisitReports = async (): Promise<VisitReport> => {
  try {
    const now = new Date();
    
    // Calculate date ranges
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    // Get visits by room for different time periods
    const dailyVisits = await getVisitsByRoomForPeriod(today.toISOString());
    const weeklyVisits = await getVisitsByRoomForPeriod(oneWeekAgo.toISOString());
    const monthlyVisits = await getVisitsByRoomForPeriod(oneMonthAgo.toISOString());
    
    return {
      daily: dailyVisits,
      weekly: weeklyVisits,
      monthly: monthlyVisits
    };
  } catch (error) {
    console.error('Error generating reports:', error);
    throw error;
  }
};

const getVisitsByRoomForPeriod = async (startDate: string): Promise<VisitsByRoom[]> => {
  try {
    const { data, error } = await supabase
      .from('visits')
      .select(`
        room_id,
        rooms (name)
      `)
      .gte('entry_time', startDate);
    
    if (error) throw error;
    
    // Count visits by room
    const roomVisits: Record<string, { roomId: string; roomName: string; count: number }> = {};
    
    data.forEach(visit => {
      const roomId = visit.room_id;
      const roomName = visit.rooms?.name || 'Unknown Room';
      
      if (!roomVisits[roomId]) {
        roomVisits[roomId] = { roomId, roomName, count: 0 };
      }
      
      roomVisits[roomId].count++;
    });
    
    return Object.values(roomVisits);
  } catch (error) {
    console.error('Error getting visits by room:', error);
    throw error;
  }
};

// Admin Authentication Functions
export const verifyAdminCredentials = async (email: string, password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .eq('status', 'active')
      .maybeSingle();
    
    if (error) throw error;
    
    return !!data; // Return true if credentials match an active company
  } catch (error) {
    console.error('Error verifying admin credentials:', error);
    return false;
  }
};
