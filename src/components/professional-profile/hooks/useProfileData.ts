
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileFormValues } from '../types';
import { saveProfileToDb, loadProfileFromDb } from '../services/profileService';

export const useProfileData = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [profileData, setProfileData] = useState<ProfileFormValues | null>(null);

  const saveProfileData = async (data: ProfileFormValues) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to save your profile.",
        variant: "destructive",
      });
      return { success: false, error: "Authentication required" };
    }
    
    setLoading(true);
    try {
      const result = await saveProfileToDb(user.id, data);
      
      // Update local state if save was successful
      if (result && result.success) {
        setProfileData(data);
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully saved.",
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile data.",
        variant: "destructive",
      });
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    } finally {
      setLoading(false);
    }
  };

  const loadProfileData = async () => {
    if (!user) {
      setLoadingInitial(false);
      return null;
    }
    
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
      setLoadingInitial(false);
    }
  };

  // Load profile data on mount
  useEffect(() => {
    if (user) {
      loadProfileData();
    } else {
      setLoadingInitial(false);
    }
  }, [user]);

  return { 
    saveProfileData, 
    loadProfileData, 
    loading, 
    loadingInitial,
    profileData 
  };
};
