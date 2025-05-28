
import { supabase } from '@/integrations/supabase/client';

export const grantAdminRights = async () => {
  const email = 'david.rehrl@thesolvia.com';
  
  try {
    const { data, error } = await supabase.functions.invoke('make-admin', {
      body: { email }
    });
    
    if (error) {
      console.error('Error granting admin rights:', error);
      throw error;
    }
    
    console.log('Admin rights granted successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to grant admin rights:', error);
    throw error;
  }
};

// Execute the function immediately
grantAdminRights()
  .then(() => {
    console.log('Admin rights granted to david.rehrl@thesolvia.com');
  })
  .catch((error) => {
    console.error('Error:', error);
  });
