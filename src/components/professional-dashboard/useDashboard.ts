
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
    const savedProfileData = localStorage.getItem('profileData');
    if (savedProfileData) {
      try {
        setProfileData(JSON.parse(savedProfileData));
      } catch (error) {
        console.error("Error parsing profile data from localStorage:", error);
      }
    }
  }, []);

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

  useEffect(() => {
    localStorage.setItem('savedVacancies', JSON.stringify(savedVacancies));
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
    localStorage.setItem('profileData', JSON.stringify(data));
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
