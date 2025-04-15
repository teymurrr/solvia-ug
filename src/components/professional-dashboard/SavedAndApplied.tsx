
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookmarkCheck, FileCheck } from 'lucide-react';
import VacancyCard from '@/components/VacancyCard';
import { NoResults } from '@/components/professional-dashboard';
import { sampleVacancies } from '@/data/sampleData';

interface SavedAndAppliedProps {
  savedTabView: 'saved' | 'applied';
  setSavedTabView: (view: 'saved' | 'applied') => void;
  savedVacancies: string[];
  appliedVacancies: string[];
  toggleSaveVacancy: (id: string) => void;
}

const SavedAndApplied: React.FC<SavedAndAppliedProps> = ({
  savedTabView,
  setSavedTabView,
  savedVacancies,
  appliedVacancies,
  toggleSaveVacancy,
}) => {
  const getSavedVacancies = () => {
    return sampleVacancies.filter(vacancy => savedVacancies.includes(vacancy.id));
  };

  const getAppliedVacancies = () => {
    return sampleVacancies.filter(vacancy => appliedVacancies.includes(vacancy.id));
  };

  const navigateToVacancies = () => {
    const tabsList = document.querySelector('[role="tablist"]');
    const vacanciesTab = tabsList?.querySelector('[value="vacancies"]') as HTMLButtonElement;
    if (vacanciesTab) vacanciesTab.click();
  };
  
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
        savedVacancies.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {getSavedVacancies().map((vacancy) => (
              <VacancyCard
                key={vacancy.id}
                {...vacancy}
                showSaveOption={true}
                isSaved={true}
                onSaveToggle={toggleSaveVacancy}
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
        appliedVacancies.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {getAppliedVacancies().map((vacancy) => (
              <VacancyCard
                key={vacancy.id}
                {...vacancy}
                showSaveOption={true}
                isSaved={savedVacancies.includes(vacancy.id)}
                onSaveToggle={toggleSaveVacancy}
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
