
import { supabase } from './baseService';
import { Room } from '@/types';

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
