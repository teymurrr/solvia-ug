import React, { useState, useMemo } from 'react';
import MainLayout from '@/components/MainLayout';
import BlurredJobCard from '@/components/vacancies/BlurredJobCard';
import MiniOnboardingForm, { FilterData } from '@/components/vacancies/MiniOnboardingForm';
import CountryComparisonBar from '@/components/vacancies/CountryComparisonBar';
import HomologationPlanPanel from '@/components/vacancies/HomologationPlanPanel';
import UnlockedJobCard from '@/components/vacancies/UnlockedJobCard';
import { useVacancies } from '@/hooks/useVacancies';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Lock, Sparkles, Filter } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import SEO from '@/components/SEO';

// Mock blurred job data — specialty keys reference translations
const mockBlurredJobs = [
  { hospital: 'Hospital Universitario de Hamburgo', specialtyKey: 'pediatrics', city: 'Hamburgo', country: 'germany', profession: 'doctor', salaryRange: '68.000 - 78.000 €/año' },
  { hospital: 'Charité Berlin', specialtyKey: 'cardiology', city: 'Berlín', country: 'germany', profession: 'doctor', salaryRange: '75.000 - 94.000 €/año' },
  { hospital: 'Klinikum München', specialtyKey: 'generalSurgery', city: 'Múnich', country: 'germany', profession: 'doctor', salaryRange: '72.000 - 88.000 €/año' },
  { hospital: 'AKH Wien', specialtyKey: 'neurology', city: 'Viena', country: 'austria', profession: 'doctor', salaryRange: '78.000 - 98.000 €/año' },
  { hospital: 'Hospital Clínic Barcelona', specialtyKey: 'generalNursing', city: 'Barcelona', country: 'spain', profession: 'nurse', salaryRange: '42.000 - 55.000 €/año' },
  { hospital: 'Hôpital Universitaire Lyon', specialtyKey: 'anesthesiology', city: 'Lyon', country: 'france', profession: 'doctor', salaryRange: '70.000 - 85.000 €/año' },
];

const VacanciesConversion = () => {
  const { t, currentLanguage } = useLanguage();
  const { vacancies, loading } = useVacancies();
  const [filters, setFilters] = useState<FilterData>({ profession: '', targetCountry: '' });
  const [savedVacancies, setSavedVacancies] = useState<string[]>([]);

  const handleFilter = (newFilters: FilterData) => {
    setFilters(newFilters);
  };

  const getCountryDisplayName = (countryId: string): string => {
    return t?.vacancies?.countries?.[countryId as keyof typeof t.vacancies.countries] || countryId;
  };

  const getProfessionLabel = (profKey: string): string => {
    return t?.vacancies?.professions?.[profKey as keyof typeof t.vacancies.professions] || profKey;
  };

  // Filter blurred jobs based on selected country and profession
  const filteredBlurredJobs = useMemo(() => {
    let filtered = mockBlurredJobs;
    
    if (filters.targetCountry) {
      filtered = filtered.filter(job => 
        job.country.toLowerCase() === filters.targetCountry.toLowerCase()
      );
    }
    
    if (filters.profession) {
      filtered = filtered.filter(job => 
        job.profession.toLowerCase() === filters.profession.toLowerCase()
      );
    }
    
    return filtered;
  }, [filters.targetCountry, filters.profession]);

  // Filter real vacancies based on selected country
  const filteredVacancies = useMemo(() => {
    if (!filters.targetCountry) return vacancies;
    return vacancies.filter(vacancy => 
      vacancy.country?.toLowerCase() === filters.targetCountry.toLowerCase()
    );
  }, [vacancies, filters.targetCountry]);

  const toggleSaveVacancy = (id: string) => {
    setSavedVacancies(prev => 
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const hasActiveFilters = filters.profession || filters.targetCountry;

  const seoData = (t as any)?.seo?.vacancies;

  return (
    <MainLayout>
      <SEO
        title={seoData?.title || 'Medical Jobs in Europe – Doctor & Nurse Positions'}
        description={seoData?.description || 'Browse verified medical job openings across Germany, Austria, Spain, France and Italy.'}
        path="/vacancies"
      />
      <section className="bg-gradient-to-b from-primary/10 to-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <Badge variant="secondary" className="mb-4">
              <Briefcase className="h-4 w-4 mr-2" />
              {t?.vacancies?.verifiedOffers || 'Verified Offers'}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold">
              {t?.vacancies?.heroTitle || 'Work in Europe: opportunities based on your specialty'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t?.vacancies?.heroSubtitle || 'Filter by profession and country to see relevant offers'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="space-y-8">

            {/* Job Cards Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span className="text-sm">{t?.vacancies?.preview || 'Preview of available offers'} ({filteredBlurredJobs.length})</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBlurredJobs.length > 0 ? (
                  filteredBlurredJobs.map((job, index) => (
                    <BlurredJobCard
                      key={index}
                      hospital={job.hospital}
                      specialty={t?.vacancies?.specialties?.[job.specialtyKey as keyof typeof t.vacancies.specialties] || job.specialtyKey}
                      city={job.city}
                      country={getCountryDisplayName(job.country)}
                      salaryRange={job.salaryRange}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    <p>{t?.vacancies?.noOffers || 'No offers available for the selected filters.'}</p>
                    <p className="text-sm mt-2">{t?.vacancies?.tryOtherFilters || 'Try other filters or clear the search.'}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Country Comparison */}
            <CountryComparisonBar 
              profession={filters.profession}
              specialty=""
            />

          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default VacanciesConversion;
