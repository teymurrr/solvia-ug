
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';

// Define proper types for vacancy
export interface Vacancy {
  id: string;
  title: string;
  institution: string;
  department: string;
  specialty?: string;
  profession?: string;
  job_type: string;
  contract_type: string;
  country?: string;
  city?: string;
  location: string;
  description: string;
  requirements: string[];
  application_deadline?: string;
  posted_date: string;
  salary?: string;
  institution_id?: string;
}

// Define input type for adding a vacancy
export interface VacancyInput {
  title: string;
  institution: string;
  department: string;
  specialty?: string;
  profession?: string;
  contract_type: string;
  job_type?: string;
  country?: string;
  city?: string;
  location: string;
  description: string;
  requirements: string | string[];
  application_deadline?: string;
  salary?: string;
}

export const useVacancies = () => {
  const { toast } = useToast();
  const { session } = useAuth();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all vacancies on component mount
  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('vacancies')
          .select('*')
          .order('posted_date', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        // Format data to match Vacancy interface
        const formattedVacancies = data.map((vacancy) => ({
          ...vacancy,
          job_type: vacancy.job_type || vacancy.contract_type,
          posted_date: vacancy.posted_date || new Date().toISOString(),
        }));
        
        setVacancies(formattedVacancies);
      } catch (error) {
        console.error('Error fetching vacancies:', error);
        setError('Failed to load vacancies');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVacancies();
  }, []);

  const handleAddVacancy = async (vacancyData: VacancyInput) => {
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in as an institution to post vacancies.",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      // Process requirements to ensure it's always an array
      const requirements = typeof vacancyData.requirements === 'string' 
        ? vacancyData.requirements.split('\n').filter((line: string) => line.trim() !== '')
        : Array.isArray(vacancyData.requirements) 
          ? vacancyData.requirements
          : [];
          
      // Process and standardize the vacancy data
      const newVacancy = { 
        ...vacancyData, 
        requirements,
        // Ensure jobType is set from contractType if not provided
        job_type: vacancyData.job_type || vacancyData.contract_type,
        institution_id: session.user.id,
      };
      
      const { data, error } = await supabase
        .from('vacancies')
        .insert(newVacancy)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Add the new vacancy to state
      setVacancies([data, ...vacancies]);
      
      toast({
        title: "Vacancy Created",
        description: "Your vacancy has been published successfully.",
      });
      
      return data;
      
    } catch (error: any) {
      console.error('Error adding vacancy:', error);
      toast({
        title: "Error Creating Vacancy",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleDeleteVacancy = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vacancies')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Remove the deleted vacancy from state
      setVacancies(vacancies.filter(vacancy => vacancy.id !== id));
      
      toast({
        title: "Vacancy Deleted",
        description: "The vacancy has been removed from your listings.",
      });
      
    } catch (error: any) {
      console.error('Error deleting vacancy:', error);
      toast({
        title: "Error Deleting Vacancy",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { 
    vacancies, 
    handleAddVacancy, 
    handleDeleteVacancy, 
    loading,
    error 
  };
};
