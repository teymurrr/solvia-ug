
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Define proper types for vacancy
export interface Vacancy {
  id: string;
  title: string;
  institution: string;
  department: string;
  specialty?: string;
  profession?: string;
  jobType: string;
  contractType: string;
  country?: string;
  city?: string;
  location: string;
  description: string;
  requirements: string[];
  applicationDeadline?: string;
  postedDate: string;
  salary?: string;
}

// Define input type for adding a vacancy
export interface VacancyInput {
  title: string;  // Required field
  institution: string;  // Required field
  department: string;  // Required field
  specialty?: string;
  profession?: string;
  contractType: string;  // Required field
  jobType?: string;  // Added to match usage in handleAddVacancy
  country?: string;
  city?: string;
  location: string;  // Required field
  description: string;  // Required field
  requirements: string | string[];  // Can accept both string and array format
  applicationDeadline?: string;
  postedDate?: string;
  salary?: string;
}

export const useVacancies = () => {
  const { toast } = useToast();
  
  const [vacancies, setVacancies] = useState<Vacancy[]>(() => {
    try {
      const savedVacancies = localStorage.getItem('institutionVacancies');
      return savedVacancies ? JSON.parse(savedVacancies) : [];
    } catch (error) {
      console.error('Error loading vacancies:', error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('institutionVacancies', JSON.stringify(vacancies));
  }, [vacancies]);

  const handleAddVacancy = (vacancyData: VacancyInput) => {
    // Process requirements to ensure it's always an array
    const requirements = typeof vacancyData.requirements === 'string' 
      ? vacancyData.requirements.split('\n').filter((line: string) => line.trim() !== '')
      : Array.isArray(vacancyData.requirements) 
        ? vacancyData.requirements
        : [];
        
    // Process and standardize the vacancy data
    const newVacancy: Vacancy = { 
      ...vacancyData, 
      id: Date.now().toString(),
      requirements,
      // Ensure jobType is set from contractType if not provided
      jobType: vacancyData.jobType || vacancyData.contractType,
      contractType: vacancyData.contractType || 'Full-time',
      // Set posted date if not provided
      postedDate: vacancyData.postedDate || new Date().toISOString(),
    };
    
    setVacancies([...vacancies, newVacancy]);
    
    toast({
      title: "Vacancy Created",
      description: "Your vacancy has been saved and will persist even after page refresh.",
    });
    
    return newVacancy;
  };

  const handleDeleteVacancy = (id: string | number) => {
    setVacancies(vacancies.filter(vacancy => vacancy.id !== id));
    
    toast({
      title: "Vacancy Deleted",
      description: "The vacancy has been removed from your listings.",
    });
  };

  return { vacancies, handleAddVacancy, handleDeleteVacancy };
};
