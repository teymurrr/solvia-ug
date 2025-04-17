
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileFormValues } from '../types';
import { saveProfileToDb, loadProfileFromDb } from '../services/profileService';

export const useProfileData = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const saveProfileData = async (data: ProfileFormValues) => {
    if (!user) return;
    
    setLoading(true);
    try {
      await saveProfileToDb(user.id, data);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully saved.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile data.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadProfileData = async () => {
    if (!user) return null;
    
    try {
      return await loadProfileFromDb(user.id);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      });
      return null;
    }
  };

  return { saveProfileData, loadProfileData, loading };
};

