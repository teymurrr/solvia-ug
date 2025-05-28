
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useOwner = () => {
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, isLoggedIn, loading: authLoading } = useAuth();

  useEffect(() => {
    const checkOwnerStatus = () => {
      console.log('🔍 [useOwner] Starting owner check...');
      console.log('🔍 [useOwner] User object:', user);
      console.log('🔍 [useOwner] User email:', user?.email);
      console.log('🔍 [useOwner] isLoggedIn:', isLoggedIn);
      console.log('🔍 [useOwner] authLoading:', authLoading);

      if (!user?.email) {
        console.log('❌ [useOwner] No user email found, setting isOwner to false');
        setIsOwner(false);
        setLoading(false);
        return;
      }

      // Only tmammadovv@gmail.com is considered the owner
      const ownerEmail = 'tmammadovv@gmail.com';
      const userEmail = user.email.toLowerCase().trim();
      const ownerEmailNormalized = ownerEmail.toLowerCase().trim();
      const userIsOwner = userEmail === ownerEmailNormalized;
      
      console.log('🔍 [useOwner] Owner email (normalized):', ownerEmailNormalized);
      console.log('🔍 [useOwner] User email (normalized):', userEmail);
      console.log('🔍 [useOwner] Email match:', userIsOwner);
      console.log('🔍 [useOwner] Email comparison details:');
      console.log('  - User email length:', userEmail.length);
      console.log('  - Owner email length:', ownerEmailNormalized.length);
      console.log('  - Character codes:', userEmail.split('').map(c => c.charCodeAt(0)));
      console.log('✅ [useOwner] Final owner status:', userIsOwner);
      
      setIsOwner(userIsOwner);
      setLoading(false);
    };

    console.log('🔍 [useOwner] useEffect triggered');
    console.log('🔍 [useOwner] State - isLoggedIn:', isLoggedIn, 'authLoading:', authLoading, 'user:', !!user);
    
    // Wait for auth loading to complete before checking owner status
    if (!authLoading) {
      if (isLoggedIn && user?.email) {
        console.log('🔍 [useOwner] User is logged in with email, checking owner status');
        checkOwnerStatus();
      } else {
        console.log('🔍 [useOwner] User is not logged in or has no email, setting isOwner to false');
        console.log('🔍 [useOwner] Details - isLoggedIn:', isLoggedIn, 'hasEmail:', !!user?.email);
        setIsOwner(false);
        setLoading(false);
      }
    } else {
      console.log('🔍 [useOwner] Auth still loading, waiting...');
      setLoading(true);
    }
  }, [user, isLoggedIn, authLoading]);

  // Add additional debug logging for the hook's return values
  console.log('🔍 [useOwner] Hook returning - isOwner:', isOwner, 'loading:', loading, 'authLoading:', authLoading);
  
  return { isOwner, loading };
};
