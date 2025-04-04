
import { supabase } from '../baseService';
import { CreateVisitParams } from './types';

/**
 * Creates a new visit in the database
 * @param params Object containing visit parameters
 * @returns Promise<string> ID of the created visit
 */
export const createVisit = async (params: CreateVisitParams): Promise<string> => {
  try {
    const { visitorId, roomId, responsible, badgeCode, companions, companyId } = params;
    
    // 1. Create the visit
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
      .select('id')
      .single();
    
    if (visitError) throw visitError;
    
    const visitId = visitData.id;
    
    // 2. Add companions if any
    if (companions && companions.length > 0) {
      const companionsToInsert = companions.map(companion => ({
        name: companion.name,
        document: companion.document,
        visit_id: visitId
      }));
      
      const { error: companionsError } = await supabase
        .from('companions')
        .insert(companionsToInsert);
      
      if (companionsError) throw companionsError;
    }
    
    // 3. Create badge record (if needed)
    const { error: badgeError } = await supabase
      .from('badges')
      .insert({
        code: badgeCode,
        visit_id: visitId,
        is_active: true
      });
    
    if (badgeError) throw badgeError;
    
    return visitId;
  } catch (error) {
    console.error('Error creating visit:', error);
    throw error;
  }
};
