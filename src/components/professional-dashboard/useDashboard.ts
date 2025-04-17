
import { useState, useEffect, useCallback } from 'react';
import { ProfileFormValues } from '@/components/professional-profile/types';
import { useProfileData } from '@/components/professional-profile/hooks/useProfileData';

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
  const { loadProfileData } = useProfileData();

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
  }, []);

  // Load profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const data = await loadProfileData();
        if (data) {
          console.log("Dashboard loaded profile data:", data);
          setProfileData(data);
        } else {
          console.log("No profile data found in dashboard, using defaults");
          setProfileData(defaultProfileData);
        }
      } catch (error) {
        console.error("Error loading profile data in dashboard:", error);
        setProfileData(defaultProfileData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [loadProfileData]);

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

  const handleProfileSave = useCallback((data: ProfileFormValues) => {
    console.log("Saving profile data in dashboard:", data);
    setProfileData(data);
  }, []);

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
    loading
  };
}
