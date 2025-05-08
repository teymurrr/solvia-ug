
import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { BookmarkCheck, FileCheck } from 'lucide-react';
import VacancyCard from '@/components/VacancyCard';
import { NoResults } from '@/components/professional-dashboard';
import { Vacancy } from '@/hooks/useVacancies';
import { Skeleton } from '@/components/ui/skeleton';

interface SavedAndAppliedProps {
  savedTabView: 'saved' | 'applied';
  setSavedTabView: (view: 'saved' | 'applied') => void;
  savedVacancies: string[];
  appliedVacancies: string[];
  toggleSaveVacancy: (id: string) => void;
  availableVacancies: Vacancy[];
  loading?: boolean;
}

const SavedAndApplied: React.FC<SavedAndAppliedProps> = ({
  savedTabView,
  setSavedTabView,
  savedVacancies,
  appliedVacancies,
  toggleSaveVacancy,
  availableVacancies,
  loading = false
}) => {
  // Use memoization to avoid recalculating these lists unnecessarily
  const savedVacanciesList = useMemo(() => {
    return availableVacancies.filter(vacancy => savedVacancies.includes(vacancy.id));
  }, [availableVacancies, savedVacancies]);

  const appliedVacanciesList = useMemo(() => {
    return availableVacancies.filter(vacancy => appliedVacancies.includes(vacancy.id));
  }, [availableVacancies, appliedVacancies]);

  const navigateToVacancies = () => {
    const tabsList = document.querySelector('[role="tablist"]');
    const vacanciesTab = tabsList?.querySelector('[value="vacancies"]') as HTMLButtonElement;
    if (vacanciesTab) vacanciesTab.click();
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex mt-2 sm:mt-0 justify-end">
        <Button 
          variant={savedTabView === 'saved' ? "default" : "outline"} 
          size="sm"
          onClick={() => setSavedTabView('saved')}
          className="rounded-r-none"
        >
          <BookmarkCheck className="h-4 w-4 mr-2" />
          Saved
        </Button>
        <Button 
          variant={savedTabView === 'applied' ? "default" : "outline"} 
          size="sm"
          onClick={() => setSavedTabView('applied')}
          className="rounded-l-none"
        >
          <FileCheck className="h-4 w-4 mr-2" />
          Applied
        </Button>
      </div>
      
      {savedTabView === 'saved' ? (
        savedVacancies.length > 0 && savedVacanciesList.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {savedVacanciesList.map((vacancy) => (
              <VacancyCard
                key={vacancy.id}
                {...vacancy}
                jobType={vacancy.job_type}
                showSaveOption={true}
                isSaved={true}
                onSaveToggle={toggleSaveVacancy}
                isDashboardCard={true}
              />
            ))}
          </div>
        ) : (
          <NoResults
            title="No saved vacancies"
            description="Save vacancies you're interested in to view them later"
            actionLabel="Browse Vacancies"
            onAction={navigateToVacancies}
          />
        )
      ) : (
        appliedVacancies.length > 0 && appliedVacanciesList.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {appliedVacanciesList.map((vacancy) => (
              <VacancyCard
                key={vacancy.id}
                {...vacancy}
                jobType={vacancy.job_type}
                showSaveOption={true}
                isSaved={savedVacancies.includes(vacancy.id)}
                onSaveToggle={toggleSaveVacancy}
                isDashboardCard={true}
              />
            ))}
          </div>
        ) : (
          <NoResults
            title="No applications yet"
            description="When you apply for vacancies, they will appear here"
            actionLabel="Browse Vacancies"
            onAction={navigateToVacancies}
          />
        )
      )}
    </div>
  );
};

export default SavedAndApplied;
