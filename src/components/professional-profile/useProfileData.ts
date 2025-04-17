
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
      // Save main profile data
      const { error: profileError } = await supabase
        .from('profiles')
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
          fsp_certificate: data.fspCertificate,
          fsp_certificate_file: data.fspCertificateFile,
        });

      if (profileError) throw profileError;

      // Handle experiences
      if (data.experiences && data.experiences.length > 0) {
        // Remove existing experiences first
        await supabase
          .from('experiences')
          .delete()
          .eq('profile_id', user.id);
          
        // Add updated experiences
        const experiencesData = data.experiences.map(exp => ({
          profile_id: user.id,
          hospital: exp.hospital,
          location: exp.location,
          role: exp.role,
          start_date: exp.startDate,
          end_date: exp.endDate || null,
          current: exp.current || false
        }));
        
        const { error: expError } = await supabase
          .from('experiences')
          .insert(experiencesData);
          
        if (expError) throw expError;
      }
      
      // Handle education
      if (data.education && data.education.length > 0) {
        // Remove existing education entries first
        await supabase
          .from('education')
          .delete()
          .eq('profile_id', user.id);
          
        // Add updated education
        const educationData = data.education.map(edu => ({
          profile_id: user.id,
          institution: edu.institution,
          degree: edu.degree,
          field: edu.field,
          start_date: edu.startDate,
          end_date: edu.endDate || null,
          current: edu.current || false
        }));
        
        const { error: eduError } = await supabase
          .from('education')
          .insert(educationData);
          
        if (eduError) throw eduError;
      }
      
      // Handle languages
      if (data.languages && data.languages.length > 0) {
        // Remove existing language entries first
        await supabase
          .from('languages')
          .delete()
          .eq('profile_id', user.id);
          
        // Add updated languages
        const languagesData = data.languages.map(lang => ({
          profile_id: user.id,
          language: lang.language,
          level: lang.level,
          certificate: lang.certificate || null
        }));
        
        const { error: langError } = await supabase
          .from('languages')
          .insert(languagesData);
          
        if (langError) throw langError;
      }

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
      // Load main profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" which just means no profile yet
        console.error('Error loading profile:', profileError);
        return null;
      }

      // Load experiences
      const { data: experiencesData } = await supabase
        .from('experiences')
        .select('*')
        .eq('profile_id', user.id);

      // Load education 
      const { data: educationData } = await supabase
        .from('education')
        .select('*')
        .eq('profile_id', user.id);

      // Load languages
      const { data: languagesData } = await supabase
        .from('languages')
        .select('*')
        .eq('profile_id', user.id);

      // Map the database data to our frontend model
      if (profileData) {
        // Convert DB field names to camelCase for frontend
        const experiences: Experience[] = experiencesData ? experiencesData.map(exp => ({
          hospital: exp.hospital || '',
          location: exp.location || '',
          role: exp.role || '',
          startDate: exp.start_date || '',
          endDate: exp.end_date || '',
          current: exp.current || false
        })) : [];

        const education: Education[] = educationData ? educationData.map(edu => ({
          institution: edu.institution || '',
          degree: edu.degree || '',
          field: edu.field || '',
          startDate: edu.start_date || '',
          endDate: edu.end_date || '',
          current: edu.current || false
        })) : [];

        const languages: Language[] = languagesData ? languagesData.map(lang => ({
          language: lang.language || '',
          level: lang.level || '',
          certificate: lang.certificate || ''
        })) : [];

        return {
          firstName: profileData.first_name || '',
          lastName: profileData.last_name || '',
          specialty: profileData.specialty || '',
          location: profileData.location || '',
          profession: profileData.profession || '',
          about: profileData.about || '',
          profileImage: profileData.profile_image || '',
          activelySearching: profileData.actively_searching || false,
          openToRelocation: profileData.open_to_relocation || false,
          experiences,
          education,
          languages,
          fspCertificate: profileData.fsp_certificate || false,
          fspCertificateFile: profileData.fsp_certificate_file || '',
          email: '', // Add an empty email field to match ProfileFormValues type
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
