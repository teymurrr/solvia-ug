
import React, { useState, useEffect } from 'react';
import VacancyCard from '@/components/VacancyCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Vacancy } from '@/hooks/useVacancies';

interface SavedAndAppliedProps {
  userId: string;
}

const SavedAndApplied: React.FC<SavedAndAppliedProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'saved' | 'applied'>('saved');
  const [isLoading, setIsLoading] = useState(true);
  const [savedVacancies, setSavedVacancies] = useState<Vacancy[]>([]);
  const [appliedVacancies, setAppliedVacancies] = useState<Vacancy[]>([]);
  const { toast } = useToast();

  const refreshSavedVacancies = async () => {
    try {
      // First get the saved vacancy IDs
      const { data: savedData, error: savedError } = await supabase
        .from('saved_vacancies')
        .select('vacancy_id')
        .eq('user_id', userId);
      
      if (savedError) throw savedError;
      
      if (savedData.length === 0) {
        setSavedVacancies([]);
        return;
      }
      
      // Get the actual vacancy details
      const savedIds = savedData.map(item => item.vacancy_id);
      const { data: vacanciesData, error: vacanciesError } = await supabase
        .from('vacancies')
        .select('*')
        .in('id', savedIds);
        
      if (vacanciesError) throw vacanciesError;
      
      setSavedVacancies(vacanciesData || []);
    } catch (error) {
      console.error('Error loading saved vacancies:', error);
      toast({
        title: 'Error',
        description: 'Could not load your saved vacancies.',
        variant: 'destructive',
      });
    }
  };

  const refreshAppliedVacancies = async () => {
    try {
      // First get the applied vacancy IDs
      const { data: appliedData, error: appliedError } = await supabase
        .from('applied_vacancies')
        .select('vacancy_id')
        .eq('user_id', userId);
      
      if (appliedError) throw appliedError;
      
      if (appliedData.length === 0) {
        setAppliedVacancies([]);
        return;
      }
      
      // Get the actual vacancy details
      const appliedIds = appliedData.map(item => item.vacancy_id);
      const { data: vacanciesData, error: vacanciesError } = await supabase
        .from('vacancies')
        .select('*')
        .in('id', appliedIds);
        
      if (vacanciesError) throw vacanciesError;
      
      setAppliedVacancies(vacanciesData || []);
    } catch (error) {
      console.error('Error loading applied vacancies:', error);
      toast({
        title: 'Error',
        description: 'Could not load your applied vacancies.',
        variant: 'destructive',
      });
    }
  };

  const removeSavedVacancy = async (vacancyId: string) => {
    try {
      const { error } = await supabase
        .from('saved_vacancies')
        .delete()
        .eq('user_id', userId)
        .eq('vacancy_id', vacancyId);
        
      if (error) throw error;
      
      setSavedVacancies(prev => prev.filter(vacancy => vacancy.id !== vacancyId));
    } catch (error) {
      console.error('Error removing saved vacancy:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          refreshSavedVacancies(),
          refreshAppliedVacancies()
        ]);
      } catch (error) {
        console.error('Error loading saved/applied vacancies:', error);
        toast({
          title: 'Error loading data',
          description: 'Could not load your saved and applied vacancies.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const handleToggleSave = async (vacancyId: string) => {
    try {
      await removeSavedVacancy(vacancyId);
      toast({
        title: 'Vacancy removed',
        description: 'The vacancy has been removed from your saved list.',
      });
    } catch (error) {
      console.error('Error removing saved vacancy:', error);
      toast({
        title: 'Error',
        description: 'Could not remove the vacancy from saved.',
        variant: 'destructive',
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg text-gray-600">Loading your vacancies...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue="saved" 
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'saved' | 'applied')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="saved">Saved Vacancies</TabsTrigger>
          <TabsTrigger value="applied">Applied Vacancies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="saved" className="space-y-6">
          {savedVacancies.length === 0 ? (
            <div className="text-center py-12 border rounded-md bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">No saved vacancies</h3>
              <p className="mt-2 text-gray-600">
                You haven't saved any vacancies yet. Save vacancies to keep track of them.
              </p>
              <Button className="mt-4" asChild>
                <a href="/vacancies">Browse Vacancies</a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedVacancies.map((vacancy) => (
                <VacancyCard
                  key={vacancy.id}
                  id={vacancy.id}
                  title={vacancy.title}
                  institution={vacancy.institution}
                  department={vacancy.department}
                  specialty={vacancy.specialty || 'Various'}
                  jobType={vacancy.job_type}
                  location={vacancy.location}
                  createdAt={vacancy.posted_date ? new Date(vacancy.posted_date).toLocaleDateString() : undefined}
                  isDashboardCard={true}
                  isSaved={true}
                  onSaveToggle={() => handleToggleSave(vacancy.id)}
                  showSaveOption={true}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="applied" className="space-y-6">
          {appliedVacancies.length === 0 ? (
            <div className="text-center py-12 border rounded-md bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
              <p className="mt-2 text-gray-600">
                You haven't applied to any vacancies yet. Start applying to find your next role.
              </p>
              <Button className="mt-4" asChild>
                <a href="/vacancies">Browse Vacancies</a>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {appliedVacancies.map((vacancy) => (
                <VacancyCard
                  key={vacancy.id}
                  id={vacancy.id}
                  title={vacancy.title}
                  institution={vacancy.institution}
                  department={vacancy.department}
                  specialty={vacancy.specialty || 'Various'}
                  jobType={vacancy.job_type}
                  location={vacancy.location}
                  createdAt={vacancy.posted_date ? new Date(vacancy.posted_date).toLocaleDateString() : undefined}
                  isDashboardCard={true}
                  isApplied={true}
                  isSaved={false}
                  onSaveToggle={handleToggleSave}
                  showSaveOption={true}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SavedAndApplied;
