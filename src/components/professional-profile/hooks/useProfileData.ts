
import { useState, useEffect, useCallback } from 'react';
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
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

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
        setLastUpdated(Date.now()); // Update the timestamp to trigger refreshes
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

  const loadProfileData = useCallback(async (forceRefresh = false) => {
    if (!user) {
      setLoadingInitial(false);
      return null;
    }
    
    setLoading(true);
    try {
      console.log('Loading fresh profile data for user:', user.id);
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
  }, [user, toast]);

  // Force refresh of profile data 
  const refreshProfileData = useCallback(() => {
    return loadProfileData(true);
  }, [loadProfileData]);

  // Load profile data on mount or when user changes
  useEffect(() => {
    if (user) {
      loadProfileData();
    } else {
      setLoadingInitial(false);
    }
  }, [user, loadProfileData]);

  return { 
    saveProfileData, 
    loadProfileData,
    refreshProfileData,
    loading, 
    loadingInitial,
    profileData,
    lastUpdated
  };
};
