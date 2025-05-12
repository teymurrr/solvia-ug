
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { useVacancies } from '@/hooks/useVacancies';
import VacancyCard from '@/components/VacancyCard';
import useDashboard from '@/components/professional-dashboard/useDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Vacancies = () => {
  const { vacancies, loading } = useVacancies();
  const { savedVacancies, toggleSaveVacancy, appliedVacancies } = useDashboard();
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Set loading to false once both vacancies and saved/applied data are loaded
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-12">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <span className="ml-3 text-xl">Loading vacancies...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Display message if no vacancies
  if (!vacancies || vacancies.length === 0) {
    return (
      <MainLayout>
        <div className="container py-12">
          <h1 className="text-3xl font-bold mb-6">Vacancies</h1>
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No vacancies found.</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-6">Vacancies</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vacancies.map((vacancy) => (
            <VacancyCard 
              key={vacancy.id}
              id={vacancy.id}
              title={vacancy.title}
              institution={vacancy.institution}
              location={vacancy.location}
              jobType={vacancy.job_type}
              specialty={vacancy.specialty}
              profession={vacancy.profession}
              department={vacancy.department}
              description={vacancy.description}
              requirements={vacancy.requirements}
              createdAt={vacancy.posted_date ? new Date(vacancy.posted_date).toLocaleDateString() : undefined}
              isSaved={session ? savedVacancies.includes(vacancy.id) : false}
              isApplied={session ? appliedVacancies.includes(vacancy.id) : false}
              onSaveToggle={session ? toggleSaveVacancy : undefined}
              showSaveOption={!!session}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Vacancies;
