
import { useState, useEffect } from 'react';
import { ProfileFormValues } from '@/components/professional-profile/types';

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

// Profile data storage key
const PROFILE_DATA_STORAGE_KEY = 'profileData';
const SAVED_VACANCIES_STORAGE_KEY = 'savedVacancies';

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

  const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Volunteer'];
  const countries = ['USA'];
  const cities = ['New York', 'Boston', 'Chicago', 'Los Angeles', 'Dallas', 'Miami', 'Seattle'];

  // Load profile data from localStorage on component mount
  useEffect(() => {
    const savedProfileData = localStorage.getItem(PROFILE_DATA_STORAGE_KEY);
    if (savedProfileData) {
      try {
        setProfileData(JSON.parse(savedProfileData));
      } catch (error) {
        console.error("Error parsing profile data from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    const savedVacanciesData = localStorage.getItem(SAVED_VACANCIES_STORAGE_KEY);
    if (savedVacanciesData) {
      try {
        setSavedVacancies(JSON.parse(savedVacanciesData));
      } catch (error) {
        console.error("Error parsing saved vacancies from localStorage:", error);
      }
    }
  }, []);

  // Automatically save savedVacancies to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(SAVED_VACANCIES_STORAGE_KEY, JSON.stringify(savedVacancies));
  }, [savedVacancies]);

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

  const handleProfileSave = (data: ProfileFormValues) => {
    setProfileData(data);
    // Save profile data to localStorage whenever it changes
    localStorage.setItem(PROFILE_DATA_STORAGE_KEY, JSON.stringify(data));
    console.log("Profile data saved to localStorage:", data);
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
