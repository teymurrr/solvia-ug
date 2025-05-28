
import { supabase } from '@/integrations/supabase/client';

export const makeUserAdmin = async (email: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('make-admin', {
      body: { email }
    });
    
    if (error) {
      console.error('Error making user admin:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to make user admin:', error);
    throw error;
  }
};
