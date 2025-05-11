import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Vacancy } from '@/hooks/useVacancies';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileFormValues } from '@/components/professional-profile/types';
import { useProfileData } from '@/components/professional-profile/hooks/useProfileData';
import { useVacancies } from '@/hooks/useVacancies';

export const defaultProfileData: ProfileFormValues = {
  firstName: "John",
  lastName: "Doe",
  profession: "Doctor",
  specialty: "Cardiologist",
  email: "john.doe@example.com",
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
  const { toast } = useToast();
  const { session } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [savedVacancies, setSavedVacancies] = useState<string[]>([]);
  const [appliedVacancies, setAppliedVacancies] = useState<string[]>([]);
  const [profileData, setProfileData] = useState<ProfileFormValues | null>(null); // Initialize as null instead of defaultProfileData
  const [savedTabView, setSavedTabView] = useState<'saved' | 'applied'>('saved');
  const [loading, setLoading] = useState(true);
  const [vacancyResults, setVacancyResults] = useState<Vacancy[]>([]);
  const { loadProfileData, profileData: hookProfileData, lastUpdated, refreshProfileData } = useProfileData();
  const { vacancies: institutionVacancies, loading: vacanciesLoading } = useVacancies();

  const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Volunteer'];
  const countries = ['USA'];
  const cities = ['New York', 'Boston', 'Chicago', 'Los Angeles', 'Dallas', 'Miami', 'Seattle'];

  // Load saved vacancies from Supabase
  useEffect(() => {
    const fetchSavedVacancies = async () => {
      if (!session?.user) return;
      
      try {
        const { data, error } = await supabase
          .from('saved_vacancies')
          .select('vacancy_id')
          .eq('user_id', session.user.id);
          
        if (error) {
          throw error;
        }
        
        // Extract just the vacancy IDs
        const savedIds = data.map(item => item.vacancy_id);
        setSavedVacancies(savedIds);
      } catch (error) {
        console.error("Error fetching saved vacancies:", error);
      }
    };
    
    // Fetch applied vacancies
    const fetchAppliedVacancies = async () => {
      if (!session?.user) return;
      
      try {
        const { data, error } = await supabase
          .from('applied_vacancies')
          .select('vacancy_id')
          .eq('user_id', session.user.id);
          
        if (error) {
          throw error;
        }
        
        // Extract just the vacancy IDs
        const appliedIds = data.map(item => item.vacancy_id);
        setAppliedVacancies(appliedIds);
      } catch (error) {
        console.error("Error fetching applied vacancies:", error);
      }
    };
    
    setLoading(true);
    fetchSavedVacancies();
    fetchAppliedVacancies();
    setLoading(false);
  }, [session]);

  // Update profile data when it changes in the hook
  useEffect(() => {
    if (hookProfileData) {
      console.log("Updating dashboard with fresh profile data:", hookProfileData);
      setProfileData(hookProfileData);
    }
  }, [hookProfileData, lastUpdated]);

  // Set real vacancies as the default vacancies
  useEffect(() => {
    setVacancyResults(institutionVacancies);
  }, [institutionVacancies]);

  // Load profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        await refreshProfileData();
      } catch (error) {
        console.error("Error refreshing profile data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [refreshProfileData]);

  // Toggle save vacancy - now uses Supabase
  const toggleSaveVacancy = useCallback(async (vacancyId: string) => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save vacancies.",
        variant: "destructive",
      });
      return;
    }
    
    const isSaved = savedVacancies.includes(vacancyId);
    
    try {
      if (isSaved) {
        // Delete from saved vacancies
        const { error } = await supabase
          .from('saved_vacancies')
          .delete()
          .eq('user_id', session.user.id)
          .eq('vacancy_id', vacancyId);
          
        if (error) throw error;
        
        setSavedVacancies(prev => prev.filter(id => id !== vacancyId));
        
        toast({
          title: "Vacancy Removed",
          description: "The vacancy has been removed from your saved list.",
        });
      } else {
        // Add to saved vacancies
        const { error } = await supabase
          .from('saved_vacancies')
          .insert({
            user_id: session.user.id,
            vacancy_id: vacancyId
          });
          
        if (error) throw error;
        
        setSavedVacancies(prev => [...prev, vacancyId]);
        
        toast({
          title: "Vacancy Saved",
          description: "The vacancy has been added to your saved list.",
        });
      }
    } catch (error: any) {
      console.error("Error toggling saved vacancy:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }, [savedVacancies, session, toast]);

  const toggleJobType = useCallback((jobType: string) => {
    setSelectedJobTypes(prev => {
      if (prev.includes(jobType)) {
        return prev.filter(type => type !== jobType);
      } else {
        return [...prev, jobType];
      }
    });
  }, []);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedJobTypes([]);
    setSelectedCountry('');
    setSelectedCity('');
    setActiveFilters([]);
    setCurrentPage(1);
  }, []);

  const handleProfileSave = useCallback(async (data: ProfileFormValues) => {
    setProfileData(data);
    // After profile save, ensure we refresh the data from the database
    await refreshProfileData();
  }, [refreshProfileData]);

  const handleSearch = useCallback(() => {
    let filtered = [...institutionVacancies];
    
    if (searchQuery) {
      filtered = filtered.filter(vacancy => 
        vacancy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vacancy.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vacancy.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedJobTypes.length > 0) {
      filtered = filtered.filter(vacancy => selectedJobTypes.includes(vacancy.job_type));
    }
    
    if (selectedCountry) {
      filtered = filtered.filter(vacancy => 
        vacancy.country?.includes(selectedCountry) || 
        vacancy.location.includes(selectedCountry)
      );
    }
    
    if (selectedCity) {
      filtered = filtered.filter(vacancy => 
        vacancy.city?.includes(selectedCity) || 
        vacancy.location.includes(selectedCity)
      );
    }
    
    setVacancyResults(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedJobTypes, selectedCountry, selectedCity, institutionVacancies]);

  // Mark a vacancy as applied
  const applyToVacancy = useCallback(async (vacancyId: string) => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to apply for vacancies.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      // Check if already applied
      if (appliedVacancies.includes(vacancyId)) {
        toast({
          title: "Already Applied",
          description: "You have already applied to this vacancy.",
        });
        return false;
      }
      
      // Add to applied vacancies
      const { error } = await supabase
        .from('applied_vacancies')
        .insert({
          user_id: session.user.id,
          vacancy_id: vacancyId,
          status: 'pending'
        });
        
      if (error) throw error;
      
      // Update local state
      setAppliedVacancies(prev => [...prev, vacancyId]);
      
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully.",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error applying to vacancy:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong with your application. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [appliedVacancies, session, toast]);

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
    setAppliedVacancies,
    profileData,
    savedTabView,
    setSavedTabView,
    jobTypes,
    countries,
    cities,
    toggleJobType,
    resetFilters,
    handleProfileSave,
    loading,
    refreshProfileData,
    vacancyResults,
    setVacancyResults,
    handleSearch,
    toggleSaveVacancy,
    applyToVacancy
  };
}
