
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useOwner = () => {
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    const checkOwnerStatus = () => {
      if (!user?.email) {
        setIsOwner(false);
        setLoading(false);
        return;
      }

      // Only tmammadovv@gmail.com is considered the owner
      const ownerEmail = 'tmammadovv@gmail.com';
      const userIsOwner = user.email === ownerEmail;
      
      setIsOwner(userIsOwner);
      setLoading(false);
    };

    if (isLoggedIn !== undefined) {
      if (isLoggedIn) {
        checkOwnerStatus();
      } else {
        setIsOwner(false);
        setLoading(false);
      }
    }
  }, [user, isLoggedIn]);

  return { isOwner, loading };
};
