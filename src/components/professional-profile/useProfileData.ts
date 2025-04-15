
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileFormValues } from './types';

export const useProfileData = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const saveProfileData = async (data: ProfileFormValues) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('professional_profiles')
        .upsert({
          id: user.id,
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
      const { data, error } = await supabase
        .from('professional_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        return {
          firstName: data.first_name,
          lastName: data.last_name,
          specialty: data.specialty,
          location: data.location,
          profession: data.profession,
          about: data.about,
          profileImage: data.profile_image,
          activelySearching: data.actively_searching,
          openToRelocation: data.open_to_relocation,
          experiences: data.experiences || [],
          education: data.education || [],
          languages: data.languages || [],
          fspCertificate: data.fsp_certificate,
          fspCertificateFile: data.fsp_certificate_file,
        };
      }
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
