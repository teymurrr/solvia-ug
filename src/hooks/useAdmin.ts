
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Call the is_admin function from Supabase
        const { data, error } = await supabase
          .rpc('is_admin', { uid: user.id });
        
        if (error) throw error;
        
        setIsAdmin(!!data);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn !== undefined) {
      if (isLoggedIn) {
        checkAdminStatus();
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    }
  }, [user, isLoggedIn]);

  return { isAdmin, loading };
};
