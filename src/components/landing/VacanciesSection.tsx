
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import VacancyCard from '@/components/VacancyCard';
import { useLanguage } from '@/hooks/useLanguage';

interface VacanciesSectionProps {
  vacancies: any[];
}

const VacanciesSection: React.FC<VacanciesSectionProps> = ({ vacancies }) => {
  const { t } = useLanguage();
  
  // Default values in case translations aren't loaded yet
  const title = t?.vacancies?.title || "Vacancies";
  const subtitle = t?.vacancies?.subtitle || "Discover exciting opportunities at leading healthcare institutions";
  const viewMore = t?.vacancies?.viewMore || "View More";
  
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="space-y-6 mb-8">
          <h2 className="text-[42px] font-bold text-gray-900 leading-tight">
            {title}
          </h2>
          <p className="text-[20px] text-gray-600">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {vacancies.map((vacancy) => (
            <VacancyCard
              key={vacancy.id}
              {...vacancy}
              showSaveOption={false}
              className="border-transparent landing-vacancy-card"
              isLandingPageCard={true}
              fromLandingPage={true}
              showDescription={true}
              showRequirements={true}
            />
          ))}
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" asChild className="group border-primary text-primary hover:bg-primary/10">
            <Link to="/signup/professional" className="flex items-center">
              {viewMore}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VacanciesSection;
