
import { supabase } from './baseService';
import { Visitor } from '@/types';

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
