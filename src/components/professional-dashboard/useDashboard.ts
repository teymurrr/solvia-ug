import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ProfileFormValues } from '@/components/professional-profile/types';
import { useToast } from '@/hooks/use-toast';

export const defaultProfileData: ProfileFormValues = {
  firstName: "",
  lastName: "",
  profession: "",
  specialty: "",
  email: "",
  location: "",
  about: "",
  experiences: [],
  education: [],
  languages: [],
  activelySearching: false,
  openToRelocation: false,
  profileImage: "",
  fspCertificate: false,
  fspCertificateFile: "",
};

export default function useDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [savedVacancies, setSavedVacancies] = useState<string[]>([]);
  const [appliedVacancies] = useState<string[]>(['1', '3']);
  const [profileData, setProfileData] = useState<ProfileFormValues>(defaultProfileData);
  const [savedTabView, setSavedTabView] = useState<'saved' | 'applied'>('saved');
  const [isLoading, setIsLoading] = useState(false);

  const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Volunteer'];
  const countries = ['USA'];
  const cities = ['New York', 'Boston', 'Chicago', 'Los Angeles', 'Dallas', 'Miami', 'Seattle'];

  // Load profile data from Supabase on component mount and user auth change
  const loadProfileData = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      // Fetch main profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Initialize data with defaults but fill in user info if available
      let combinedProfileData = {
        ...defaultProfileData,
        email: user.email || '',
      };

      // If profile exists, use it, otherwise use default with user email
      if (profileData && !profileError) {
        combinedProfileData = {
          ...combinedProfileData,
          firstName: profileData.first_name || '',
          lastName: profileData.last_name || '',
          profession: profileData.profession || '',
          specialty: profileData.specialty || '',
          location: profileData.location || '',
          about: profileData.about || '',
          activelySearching: profileData.actively_searching || false,
          openToRelocation: profileData.open_to_relocation || false,
          profileImage: profileData.profile_image || '',
          fspCertificate: profileData.fsp_certificate || false,
          fspCertificateFile: profileData.fsp_certificate_file || '',
        };
      }

      // Fetch experiences, education, languages regardless of profile existence
      const { data: experiences, error: experiencesError } = await supabase
        .from('experiences')
        .select('*')
        .eq('profile_id', user.id);

      if (!experiencesError && experiences) {
        combinedProfileData.experiences = experiences.map(exp => ({
          hospital: exp.hospital || '',
          location: exp.location || '',
          role: exp.role || '',
          startDate: exp.start_date || '',
          endDate: exp.end_date || '',
          current: exp.current || false,
        }));
      }

      const { data: education, error: educationError } = await supabase
        .from('education')
        .select('*')
        .eq('profile_id', user.id);

      if (!educationError && education) {
        combinedProfileData.education = education.map(edu => ({
          institution: edu.institution || '',
          degree: edu.degree || '',
          field: edu.field || '',
          startDate: edu.start_date || '',
          endDate: edu.end_date || '',
          current: edu.current || false,
        }));
      }

      const { data: languages, error: languagesError } = await supabase
        .from('languages')
        .select('*')
        .eq('profile_id', user.id);

      if (!languagesError && languages) {
        combinedProfileData.languages = languages.map(lang => ({
          language: lang.language || '',
          level: lang.level || '',
          certificate: lang.certificate || '',
        }));
      }

      // Set the combined profile data
      setProfileData(combinedProfileData);
    } catch (error) {
      console.error('Error loading profile data:', error);
      // Always show toast for true errors, but not for "no rows returned"
      if (error.message !== "Cannot read properties of null (reading 'first_name')" && 
          !error.details?.includes("0 rows")) {
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const handleProfileSave = async (data: ProfileFormValues) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to save profile data",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update main profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: data.firstName,
          last_name: data.lastName,
          profession: data.profession,
          specialty: data.specialty,
          location: data.location,
          about: data.about,
          actively_searching: data.activelySearching,
          open_to_relocation: data.openToRelocation,
          profile_image: data.profileImage,
          fsp_certificate: data.fspCertificate,
          fsp_certificate_file: data.fspCertificateFile,
        });

      if (profileError) throw profileError;

      // Update experiences
      if (data.experiences?.length) {
        // First delete existing experiences
        await supabase
          .from('experiences')
          .delete()
          .eq('profile_id', user.id);

        // Then insert new ones
        const { error: experiencesError } = await supabase
          .from('experiences')
          .insert(
            data.experiences.map(exp => ({
              profile_id: user.id,
              hospital: exp.hospital,
              location: exp.location,
              role: exp.role,
              start_date: exp.startDate,
              end_date: exp.endDate,
              current: exp.current,
            }))
          );

        if (experiencesError) throw experiencesError;
      }

      // Update education
      if (data.education?.length) {
        // First delete existing education records
        await supabase
          .from('education')
          .delete()
          .eq('profile_id', user.id);

        // Then insert new ones
        const { error: educationError } = await supabase
          .from('education')
          .insert(
            data.education.map(edu => ({
              profile_id: user.id,
              institution: edu.institution,
              degree: edu.degree,
              field: edu.field,
              start_date: edu.startDate,
              end_date: edu.endDate,
              current: edu.current,
            }))
          );

        if (educationError) throw educationError;
      }

      // Update languages
      if (data.languages?.length) {
        // First delete existing language records
        await supabase
          .from('languages')
          .delete()
          .eq('profile_id', user.id);

        // Then insert new ones
        const { error: languagesError } = await supabase
          .from('languages')
          .insert(
            data.languages.map(lang => ({
              profile_id: user.id,
              language: lang.language,
              level: lang.level,
              certificate: lang.certificate,
            }))
          );

        if (languagesError) throw languagesError;
      }

      setProfileData(data);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error saving profile data:', error);
      toast({
        title: "Error",
        description: "Failed to save profile data",
        variant: "destructive",
      });
    }
  };

  const toggleJobType = (jobType: string) => {
    setSelectedJobTypes(prev => {
      if (prev.includes(jobType)) {
        return prev.filter(type => type !== jobType);
      } else {
        return [...prev, jobType];
      }
    });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedJobTypes([]);
    setSelectedCountry('');
    setSelectedCity('');
    setActiveFilters([]);
    setCurrentPage(1);
  };

  return {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    selectedJobTypes,
    selectedCountry,
    setSelectedCountry,
    selectedCity,
    setSelectedCity,
    activeFilters,
    savedVacancies,
    setSavedVacancies,
    appliedVacancies,
    profileData,
    isLoading,
    savedTabView,
    setSavedTabView,
    jobTypes,
    countries,
    cities,
    toggleJobType,
    resetFilters,
    handleProfileSave,
  };
}
