
import { supabase } from './baseService';
import { VisitReport, VisitsByRoom } from '@/types';

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

export const getVisitsByRoomForPeriod = async (startDate: string): Promise<VisitsByRoom[]> => {
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

export const getCompanyVisitsByRoomForPeriod = async (companyId: string, startDate: string): Promise<VisitsByRoom[]> => {
  try {
    const { data, error } = await supabase
      .from('visits')
      .select(`
        room_id,
        rooms (name)
      `)
      .eq('company_id', companyId)
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
    console.error('Error getting company visits by room:', error);
    throw error;
  }
};
