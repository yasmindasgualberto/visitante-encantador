
import { useEffect, useState } from 'react';
import { createDefaultAdmin } from '@/services/supabase/companiesService';
import { toast } from 'sonner';

export const AdminInitializer = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        const created = await createDefaultAdmin();
        if (created) {
          toast.success('Usuário administrador padrão criado com sucesso!', {
            description: 'Email: admin@exemplo.com | Senha: admin123'
          });
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing admin:', error);
        setIsInitialized(true);
      }
    };
    
    initializeAdmin();
  }, []);
  
  return null; // This component doesn't render anything
};

export default AdminInitializer;
