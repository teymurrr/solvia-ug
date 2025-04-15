
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
          experiences: data.experiences,
          education: data.education,
          languages: data.languages,
          fsp_certificate: data.fspCertificate,
          fsp_certificate_file: data.fspCertificateFile,
        });

      if (error) throw error;

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
    if (!user) return null;
    
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
        // Properly convert the JSON data from Supabase to our typed arrays using 'as unknown as'
        // This is a safe approach when we know the structure matches our types
        const experiences = data.experiences ? (data.experiences as unknown as Experience[]) : [];
        const education = data.education ? (data.education as unknown as Education[]) : [];
        const languages = data.languages ? (data.languages as unknown as Language[]) : [];

        return {
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          specialty: data.specialty || '',
          location: data.location || '',
          profession: data.profession || '',
          about: data.about || '',
          profileImage: data.profile_image || '',
          activelySearching: data.actively_searching || false,
          openToRelocation: data.open_to_relocation || false,
          experiences: experiences,
          education: education,
          languages: languages,
          fspCertificate: data.fsp_certificate || false,
          fspCertificateFile: data.fsp_certificate_file || '',
          email: '', // Add an empty email field to match ProfileFormValues type
        };
      }
      console.log('No profile data found for user');
      return null;
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
