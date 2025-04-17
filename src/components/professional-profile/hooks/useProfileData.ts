
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
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to save your profile.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      await saveProfileToDb(user.id, data);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully saved.",
      });
      return true;
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

  const loadProfileData = async (): Promise<ProfileFormValues | null> => {
    if (!user) {
      console.log("No user found, cannot load profile");
      return null;
    }
    
    setLoading(true);
    try {
      const data = await loadProfileFromDb(user.id);
      console.log("Profile data loaded:", data);
      return data;
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { saveProfileData, loadProfileData, loading };
};
