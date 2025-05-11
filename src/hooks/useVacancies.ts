
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  salary?: string;
  institution_id?: string;
}

export const useVacancies = () => {
  const { toast } = useToast();
  const { session, user } = useAuth();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVacancies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching vacancies from Supabase");
      const { data, error } = await supabase
        .from('vacancies')
        .select('*')
        .order('posted_date', { ascending: false });
        
      if (error) {
        console.error("Supabase error fetching vacancies:", error);
        throw error;
      }
      
      console.log("Vacancies fetched from Supabase:", data);
      
      // Format data to match Vacancy interface
      const formattedVacancies = data.map((vacancy) => ({
        ...vacancy,
        job_type: vacancy.job_type || vacancy.contract_type,
        posted_date: vacancy.posted_date || new Date().toISOString(),
      }));
      
      setVacancies(formattedVacancies);
      console.log("Vacancies set in state:", formattedVacancies);
    } catch (error) {
      console.error('Error fetching vacancies:', error);
      setError('Failed to load vacancies');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all vacancies on component mount
  useEffect(() => {
    fetchVacancies();
    
    // Set up realtime subscription to vacancies table
    const channel = supabase
      .channel('table-db-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'vacancies',
      }, (payload) => {
        console.log('Realtime change received:', payload);
        fetchVacancies();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAddVacancy = async (vacancyData: VacancyInput) => {
    console.log("Starting handleAddVacancy with data:", vacancyData);
    
    if (!user || !session) {
      console.error("No authenticated user found:", { user, session });
      toast({
        title: "Authentication required",
        description: "You need to be logged in as an institution to post vacancies.",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      setSubmitting(true);
      console.log("Current user ID:", user.id);
      console.log("Processing vacancy data before submission");
      
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
        // Ensure job_type is set from contract_type if not provided
        job_type: vacancyData.job_type || vacancyData.contract_type,
        institution_id: user.id,
        posted_date: new Date().toISOString()
      };
      
      console.log("Submitting vacancy to Supabase:", newVacancy);
      
      const { data, error } = await supabase
        .from('vacancies')
        .insert(newVacancy)
        .select()
        .single();
      
      if (error) {
        console.error("Supabase error adding vacancy:", error);
        throw error;
      }
      
      console.log("Vacancy added successfully in Supabase:", data);
      
      // Add the new vacancy to state
      setVacancies(prev => [data, ...prev]);
      
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
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateVacancy = async (vacancyData: VacancyInput & { id: string }) => {
    console.log("Starting handleUpdateVacancy with data:", vacancyData);
    
    if (!user || !session) {
      console.error("No authenticated user found:", { user, session });
      toast({
        title: "Authentication required",
        description: "You need to be logged in as an institution to update vacancies.",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      setSubmitting(true);
      
      // Make sure we have the vacancy ID
      if (!vacancyData.id) {
        throw new Error("Vacancy ID is required for updates");
      }
      
      // Process requirements to ensure it's always an array
      const requirements = typeof vacancyData.requirements === 'string' 
        ? vacancyData.requirements.split('\n').filter((line: string) => line.trim() !== '')
        : Array.isArray(vacancyData.requirements) 
          ? vacancyData.requirements
          : [];
          
      // Process and standardize the vacancy data
      const updatedVacancy = { 
        ...vacancyData,
        requirements,
        // Ensure job_type is set from contract_type if not provided
        job_type: vacancyData.job_type || vacancyData.contract_type
      };
      
      console.log("Updating vacancy in Supabase:", updatedVacancy);
      
      const { data, error } = await supabase
        .from('vacancies')
        .update(updatedVacancy)
        .eq('id', vacancyData.id)
        .select()
        .single();
      
      if (error) {
        console.error("Supabase error updating vacancy:", error);
        throw error;
      }
      
      console.log("Vacancy updated successfully in Supabase:", data);
      
      // Update the vacancy in state
      setVacancies(prev => prev.map(v => v.id === data.id ? data : v));
      
      toast({
        title: "Vacancy Updated",
        description: "Your vacancy has been updated successfully.",
      });
      
      return data;
      
    } catch (error: any) {
      console.error('Error updating vacancy:', error);
      toast({
        title: "Error Updating Vacancy",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteVacancy = async (id: string) => {
    try {
      console.log("Deleting vacancy with ID:", id);
      
      const { error } = await supabase
        .from('vacancies')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Supabase error deleting vacancy:", error);
        throw error;
      }
      
      console.log("Vacancy deleted successfully");
      
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
    handleUpdateVacancy,
    handleDeleteVacancy, 
    loading,
    submitting,
    error,
    refreshVacancies: fetchVacancies
  };
};
