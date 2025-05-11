
import React, { useState, useEffect } from 'react';
import VacancyCard from '@/components/VacancyCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import useDashboard from './useDashboard'; // Fixed import

interface SavedAndAppliedProps {
  userId: string;
}

const SavedAndApplied: React.FC<SavedAndAppliedProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'saved' | 'applied'>('saved');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { 
    savedVacancies, 
    appliedVacancies, 
    removeSavedVacancy,
    refreshSavedVacancies,
    refreshAppliedVacancies
  } = useDashboard(userId);

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
  }, [userId, refreshSavedVacancies, refreshAppliedVacancies, toast]);

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
                  createdAt={vacancy.created_at ? new Date(vacancy.created_at).toLocaleDateString() : undefined}
                  isDashboardCard={true}
                  isSaved={true}
                  onSaveToggle={handleToggleSave}
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
                  createdAt={vacancy.created_at ? new Date(vacancy.created_at).toLocaleDateString() : undefined}
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
