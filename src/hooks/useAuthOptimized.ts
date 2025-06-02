
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AuthStatus {
  isAdmin: boolean;
  isOwner: boolean;
  loading: boolean;
}

export const useAuthOptimized = (): AuthStatus => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isAdmin: false,
    isOwner: false,
    loading: true,
  });
  const { user, isLoggedIn, loading: authLoading } = useAuth();

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (!user?.email) {
        setAuthStatus({ isAdmin: false, isOwner: false, loading: false });
        return;
      }

      try {
        // Check if user is owner first (simple email comparison)
        const ownerEmail = 'tmammadovv@gmail.com';
        const isOwner = user.email.toLowerCase().trim() === ownerEmail.toLowerCase().trim();
        
        // Check admin status only if needed
        const { data: isAdminData, error } = await supabase
          .rpc('is_admin', { uid: user.id });
        
        if (error) throw error;
        
        setAuthStatus({
          isAdmin: !!isAdminData,
          isOwner,
          loading: false,
        });
      } catch (error) {
        console.error('Error checking auth status:', error);
        setAuthStatus({ isAdmin: false, isOwner: false, loading: false });
      }
    };

    if (!authLoading && isLoggedIn !== undefined) {
      if (isLoggedIn && user) {
        checkAuthStatus();
      } else {
        setAuthStatus({ isAdmin: false, isOwner: false, loading: false });
      }
    }
  }, [user, isLoggedIn, authLoading]);

  return authStatus;
};
