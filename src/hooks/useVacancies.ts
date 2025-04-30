
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useVacancies = () => {
  const { toast } = useToast();
  
  const [vacancies, setVacancies] = useState<any[]>(() => {
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

  const handleAddVacancy = (vacancyData: any) => {
    // Ensure requirements is always an array for consistent display
    const requirements = typeof vacancyData.requirements === 'string' 
      ? vacancyData.requirements.split('\n').filter((line: string) => line.trim() !== '')
      : Array.isArray(vacancyData.requirements) 
        ? vacancyData.requirements
        : [];
        
    // Process and standardize the vacancy data
    const newVacancy = { 
      ...vacancyData, 
      id: Date.now().toString(),
      requirements,
      // Ensure jobType is set for display consistency
      jobType: vacancyData.jobType || vacancyData.contractType || 'Full-time',
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
