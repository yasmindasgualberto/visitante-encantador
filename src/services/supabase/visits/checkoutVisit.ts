
import { supabase } from '../baseService';

/**
 * Marks a visit as completed by setting its exit time and updating its status
 * @param id The visit ID to check out
 */
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
