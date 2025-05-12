
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Briefcase, ArrowRight } from 'lucide-react';
import VacancyCard from '@/components/VacancyCard';
import { useLanguage } from '@/hooks/useLanguage';
import { useVacancies } from '@/hooks/useVacancies';
import { Skeleton } from '@/components/ui/skeleton';

const VacanciesSection: React.FC = () => {
  const { t } = useLanguage();
  const { vacancies, loading } = useVacancies();
  
  // Default values in case translations aren't loaded yet
  const title = t?.vacancies?.title || "Vacancies";
  const subtitle = t?.vacancies?.subtitle || "Discover exciting opportunities at leading healthcare institutions";
  const viewMore = t?.vacancies?.viewMore || "View More";
  
  // Show only 2-4 vacancies on landing page
  const displayedVacancies = vacancies.slice(0, Math.min(4, vacancies.length));
  
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <Briefcase className="h-[30px] w-[30px] text-[#006ae6] mx-auto mb-4" />
          <h2 className="text-[30px] font-bold text-black">{title}</h2>
          <p className="text-lg text-muted-foreground mt-4 mb-6">
            {subtitle}
          </p>
          <Button variant="ghost" asChild className="group">
            <Link to="/signup/professional" className="flex items-center">
              {viewMore}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {loading ? (
            Array(2).fill(0).map((_, idx) => (
              <div key={idx} className="border rounded-lg p-6 space-y-4">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <div className="flex gap-2 mt-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            ))
          ) : displayedVacancies.length > 0 ? (
            displayedVacancies.map((vacancy) => (
              <VacancyCard
                key={vacancy.id}
                id={vacancy.id}
                title={vacancy.title}
                institution={vacancy.institution}
                location={vacancy.location}
                jobType={vacancy.job_type}
                specialty={vacancy.specialty || ''}
                createdAt={vacancy.posted_date ? new Date(vacancy.posted_date).toLocaleDateString() : undefined}
                description={vacancy.description}
                requirements={vacancy.requirements}
                showSaveOption={false}
                className="border-transparent landing-vacancy-card"
                isLandingPageCard={true}
                fromLandingPage={true}
                showDescription={true}
                showRequirements={true}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-10 border rounded-lg">
              <p>No vacancies available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VacanciesSection;
