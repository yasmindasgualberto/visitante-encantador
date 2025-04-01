
import { supabase } from './baseService';
import { Company } from '@/types';

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
    
    console.log('Enviando atualização para a empresa:', id, updateData);
    
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

export const verifyCompanyCredentials = async (email: string, password: string): Promise<boolean> => {
  try {
    console.log('Verifying credentials for:', email);
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .eq('status', 'active')
      .maybeSingle();
    
    if (error) {
      console.error('Error verifying company credentials:', error);
      throw error;
    }
    
    console.log('Verification result:', data ? 'Company found' : 'No company found');
    return !!data; // Return true if credentials match an active company
  } catch (error) {
    console.error('Error verifying company credentials:', error);
    return false;
  }
};

export const getCompanyByEmail = async (email: string): Promise<Company | null> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data) return null;
    
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
    console.error('Error fetching company by email:', error);
    return null;
  }
};
