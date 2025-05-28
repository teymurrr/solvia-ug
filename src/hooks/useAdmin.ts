
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    const checkAdminStatus = async () => {
      console.log('🔍 [useAdmin] Starting admin check...');
      console.log('🔍 [useAdmin] User object:', user);
      console.log('🔍 [useAdmin] User ID:', user?.id);
      console.log('🔍 [useAdmin] User email:', user?.email);
      console.log('🔍 [useAdmin] isLoggedIn:', isLoggedIn);

      if (!user) {
        console.log('❌ [useAdmin] No user found, setting isAdmin to false');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 [useAdmin] Calling is_admin RPC with user ID:', user.id);
        
        // Call the is_admin function from Supabase
        const { data, error } = await supabase
          .rpc('is_admin', { uid: user.id });
        
        console.log('🔍 [useAdmin] RPC response - data:', data);
        console.log('🔍 [useAdmin] RPC response - error:', error);
        
        if (error) {
          console.error('❌ [useAdmin] Error checking admin status:', error);
          throw error;
        }
        
        const adminStatus = !!data;
        console.log('✅ [useAdmin] Final admin status:', adminStatus);
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error('❌ [useAdmin] Catch block - Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        console.log('🔍 [useAdmin] Setting loading to false');
        setLoading(false);
      }
    };

    console.log('🔍 [useAdmin] useEffect triggered - isLoggedIn:', isLoggedIn);
    
    if (isLoggedIn !== undefined) {
      if (isLoggedIn) {
        console.log('🔍 [useAdmin] User is logged in, checking admin status');
        checkAdminStatus();
      } else {
        console.log('🔍 [useAdmin] User is not logged in, setting isAdmin to false');
        setIsAdmin(false);
        setLoading(false);
      }
    } else {
      console.log('🔍 [useAdmin] isLoggedIn is undefined, waiting...');
    }
  }, [user, isLoggedIn]);

  console.log('🔍 [useAdmin] Hook returning - isAdmin:', isAdmin, 'loading:', loading);
  return { isAdmin, loading };
};
