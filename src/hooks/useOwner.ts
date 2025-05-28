
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useOwner = () => {
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    const checkOwnerStatus = () => {
      console.log('🔍 [useOwner] Starting owner check...');
      console.log('🔍 [useOwner] User object:', user);
      console.log('🔍 [useOwner] User email:', user?.email);
      console.log('🔍 [useOwner] isLoggedIn:', isLoggedIn);

      if (!user?.email) {
        console.log('❌ [useOwner] No user email found, setting isOwner to false');
        setIsOwner(false);
        setLoading(false);
        return;
      }

      // Only tmammadovv@gmail.com is considered the owner
      const ownerEmail = 'tmammadovv@gmail.com';
      const userIsOwner = user.email === ownerEmail;
      
      console.log('🔍 [useOwner] Owner email:', ownerEmail);
      console.log('🔍 [useOwner] User email:', user.email);
      console.log('🔍 [useOwner] Email match:', userIsOwner);
      console.log('✅ [useOwner] Final owner status:', userIsOwner);
      
      setIsOwner(userIsOwner);
      setLoading(false);
    };

    console.log('🔍 [useOwner] useEffect triggered - isLoggedIn:', isLoggedIn);
    
    if (isLoggedIn !== undefined) {
      if (isLoggedIn) {
        console.log('🔍 [useOwner] User is logged in, checking owner status');
        checkOwnerStatus();
      } else {
        console.log('🔍 [useOwner] User is not logged in, setting isOwner to false');
        setIsOwner(false);
        setLoading(false);
      }
    } else {
      console.log('🔍 [useOwner] isLoggedIn is undefined, waiting...');
    }
  }, [user, isLoggedIn]);

  console.log('🔍 [useOwner] Hook returning - isOwner:', isOwner, 'loading:', loading);
  return { isOwner, loading };
};
