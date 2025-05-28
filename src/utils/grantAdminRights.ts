
import { supabase } from '@/integrations/supabase/client';

export const grantAdminRights = async () => {
  const email = 'david.rehrl@thesolvia.com';
  
  try {
    console.log('Attempting to grant admin rights to:', email);
    
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

// Execute the function immediately with better error handling
(async () => {
  try {
    console.log('Starting admin rights grant process...');
    const result = await grantAdminRights();
    console.log('Admin rights granted to david.rehrl@thesolvia.com:', result);
  } catch (error) {
    console.error('Error in admin rights grant process:', error);
    
    // Try again once more if the first attempt failed
    console.log('Retrying admin rights grant...');
    try {
      const result = await grantAdminRights();
      console.log('Admin rights granted on retry:', result);
    } catch (retryError) {
      console.error('Retry also failed:', retryError);
    }
  }
})();
