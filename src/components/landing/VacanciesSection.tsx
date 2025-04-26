import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Briefcase, ArrowRight } from 'lucide-react';
import VacancyCard from '@/components/VacancyCard';
import { useLanguage } from '@/hooks/useLanguage';

interface VacanciesSectionProps {
  vacancies: any[];
}

const VacanciesSection: React.FC<VacanciesSectionProps> = ({ vacancies }) => {
  const { t } = useLanguage();
  
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <Briefcase className="h-[30px] w-[30px] text-[#006ae6] mx-auto mb-4" />
          <h2 className="text-[30px] font-bold text-black">{t.vacancies.title}</h2>
          <p className="text-lg text-muted-foreground mt-4 mb-6">
            {t.vacancies.subtitle}
          </p>
          <Button variant="ghost" asChild className="group">
            <Link to="/signup/professional" className="flex items-center">
              {t.vacancies.viewMore}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {vacancies.map((vacancy) => (
            <VacancyCard
              key={vacancy.id}
              {...vacancy}
              showSaveOption={false}
              className="border-transparent hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              onAction={() => window.location.href = '/signup/professional'}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VacanciesSection;
