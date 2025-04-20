
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileFormValues } from '../types';
import { saveProfileToDb, loadProfileFromDb } from '../services/profileService';

export const useProfileData = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileFormValues | null>(null);

  const saveProfileData = async (data: ProfileFormValues) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to save your profile.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      await saveProfileToDb(user.id, data);
      // Update local state with the saved data
      setProfileData(data);
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
    
    setLoading(true);
    try {
      const data = await loadProfileFromDb(user.id);
      if (data) {
        setProfileData(data);
      }
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

  // Load profile data on mount
  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  return { saveProfileData, loadProfileData, loading, profileData };
};
