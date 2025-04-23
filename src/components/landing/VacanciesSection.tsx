
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Briefcase, ArrowRight } from 'lucide-react';
import VacancyCard from '@/components/VacancyCard';

interface VacanciesSectionProps {
  vacancies: any[]; // Using the existing type from VacancyCard
}

const VacanciesSection: React.FC<VacanciesSectionProps> = ({ vacancies }) => {
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Briefcase className="h-12 w-12 text-primary mx-auto mb-4" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1" />
            <h2 className="text-3xl font-bold">Vacancies</h2>
            <div className="flex-1 flex justify-end">
              <Button variant="ghost" asChild className="group">
                <Link to="/institutions" className="flex items-center">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
          <p className="text-lg text-muted-foreground mb-6">
            Discover exciting opportunities at leading healthcare institutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vacancies.map((vacancy) => (
            <VacancyCard
              key={vacancy.id}
              {...vacancy}
              showSaveOption={false}
              className="border-transparent shadow-none hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VacanciesSection;
