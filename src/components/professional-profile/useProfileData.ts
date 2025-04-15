
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileFormValues, Experience, Education, Language } from './types';

export const useProfileData = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const saveProfileData = async (data: ProfileFormValues) => {
    if (!user) return;
    
    setLoading(true);
    try {
      console.log('Saving profile data for user:', user.id);
      
      // Make sure the JSON data is properly structured for the database
      const { error } = await supabase
        .from('professional_profiles')
        .upsert({
          user_id: user.id,
          first_name: data.firstName,
          last_name: data.lastName,
          specialty: data.specialty,
          location: data.location,
          profession: data.profession,
          about: data.about,
          profile_image: data.profileImage,
          actively_searching: data.activelySearching,
          open_to_relocation: data.openToRelocation,
          experiences: data.experiences || [],
          education: data.education || [],
          languages: data.languages || [],
          fsp_certificate: data.fspCertificate,
          fsp_certificate_file: data.fspCertificateFile,
        });

      if (error) throw error;

      console.log('Profile successfully saved');
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully saved.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadProfileData = async () => {
    if (!user) {
      console.log('No user found, cannot load profile');
      return null;
    }
    
    setLoading(true);
    try {
      console.log('Loading profile data for user:', user.id);
      const { data, error } = await supabase
        .from('professional_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error loading profile from Supabase:', error);
        // If no profile exists, return null without throwing an error
        return null;
      }

      if (data) {
        console.log('Profile data loaded:', data);
        
        // Safely convert JSON data with null checks
        let experiences: Experience[] = [];
        if (data.experiences) {
          try {
            experiences = Array.isArray(data.experiences) 
              ? (data.experiences as unknown as Experience[]) 
              : [];
          } catch (e) {
            console.error('Error parsing experiences:', e);
          }
        }
        
        let education: Education[] = [];
        if (data.education) {
          try {
            education = Array.isArray(data.education) 
              ? (data.education as unknown as Education[]) 
              : [];
          } catch (e) {
            console.error('Error parsing education:', e);
          }
        }
        
        let languages: Language[] = [];
        if (data.languages) {
          try {
            languages = Array.isArray(data.languages) 
              ? (data.languages as unknown as Language[]) 
              : [];
          } catch (e) {
            console.error('Error parsing languages:', e);
          }
        }

        const profileData: ProfileFormValues = {
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          specialty: data.specialty || '',
          location: data.location || '',
          profession: data.profession || '',
          about: data.about || '',
          profileImage: data.profile_image || '',
          activelySearching: !!data.actively_searching,
          openToRelocation: !!data.open_to_relocation,
          experiences: experiences,
          education: education,
          languages: languages,
          fspCertificate: !!data.fsp_certificate,
          fspCertificateFile: data.fsp_certificate_file || '',
          email: '', // Add an empty email field to match ProfileFormValues type
        };
        
        console.log('Returning formatted profile data');
        setLoading(false);
        return profileData;
      }
      
      console.log('No profile data found for user');
      setLoading(false);
      return null;
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      });
      setLoading(false);
      return null;
    }
  };

  return { saveProfileData, loadProfileData, loading };
};
