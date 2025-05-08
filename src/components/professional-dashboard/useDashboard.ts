
import { useState, useEffect, useCallback } from 'react';
import { ProfileFormValues } from '@/components/professional-profile/types';
import { useProfileData } from '@/components/professional-profile/hooks/useProfileData';
import { useVacancies, Vacancy } from '@/hooks/useVacancies';

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
  const [loading, setLoading] = useState(true);
  const [vacancyResults, setVacancyResults] = useState<Vacancy[]>([]);
  const { loadProfileData, profileData: hookProfileData, lastUpdated, refreshProfileData } = useProfileData();
  const { vacancies: institutionVacancies } = useVacancies();

  const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Volunteer'];
  const countries = ['USA'];
  const cities = ['New York', 'Boston', 'Chicago', 'Los Angeles', 'Dallas', 'Miami', 'Seattle'];

  // Load saved vacancies from localStorage
  useEffect(() => {
    const savedVacanciesData = localStorage.getItem('savedVacancies');
    if (savedVacanciesData) {
      try {
        setSavedVacancies(JSON.parse(savedVacanciesData));
      } catch (error) {
        console.error("Error parsing saved vacancies from localStorage:", error);
      }
    }
    setLoading(false);
  }, []);

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

  // Save vacancies to localStorage when they change
  useEffect(() => {
    localStorage.setItem('savedVacancies', JSON.stringify(savedVacancies));
  }, [savedVacancies]);

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
      filtered = filtered.filter(vacancy => selectedJobTypes.includes(vacancy.jobType));
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
    handleSearch
  };
}
