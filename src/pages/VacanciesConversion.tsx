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

// Mock blurred job data for the locked state
const mockBlurredJobs = [
  { hospital: 'Hospital Universitario de Hamburgo', specialty: 'Pediatría', city: 'Hamburgo', country: 'germany', profession: 'doctor', salaryRange: '52.000 - 60.000 €/año' },
  { hospital: 'Charité Berlin', specialty: 'Cardiología', city: 'Berlín', country: 'germany', profession: 'doctor', salaryRange: '58.000 - 72.000 €/año' },
  { hospital: 'Klinikum München', specialty: 'Cirugía General', city: 'Múnich', country: 'germany', profession: 'doctor', salaryRange: '55.000 - 68.000 €/año' },
  { hospital: 'AKH Wien', specialty: 'Neurología', city: 'Viena', country: 'austria', profession: 'doctor', salaryRange: '60.000 - 75.000 €/año' },
  { hospital: 'Hospital Clínic Barcelona', specialty: 'Enfermería General', city: 'Barcelona', country: 'spain', profession: 'nurse', salaryRange: '32.000 - 42.000 €/año' },
  { hospital: 'Hôpital Universitaire Lyon', specialty: 'Anestesiología', city: 'Lyon', country: 'france', profession: 'doctor', salaryRange: '54.000 - 65.000 €/año' },
];

const getCountryDisplayNames = (lang?: string): Record<string, string> => {
  if (lang === 'es') {
    return { germany: 'Alemania', austria: 'Austria', spain: 'España', france: 'Francia' };
  } else if (lang === 'de') {
    return { germany: 'Deutschland', austria: 'Österreich', spain: 'Spanien', france: 'Frankreich' };
  } else if (lang === 'fr') {
    return { germany: 'Allemagne', austria: 'Autriche', spain: 'Espagne', france: 'France' };
  }
  return { germany: 'Germany', austria: 'Austria', spain: 'Spain', france: 'France' };
};

const VacanciesConversion = () => {
  const { t, currentLanguage } = useLanguage();
  const { vacancies, loading } = useVacancies();
  const [filters, setFilters] = useState<FilterData>({ profession: '', targetCountry: '' });
  const [savedVacancies, setSavedVacancies] = useState<string[]>([]);

  const countryDisplayNames = getCountryDisplayNames(currentLanguage);

  const handleFilter = (newFilters: FilterData) => {
    setFilters(newFilters);
  };

  const getCountryDisplayName = (countryId: string): string => {
    return countryDisplayNames[countryId] || countryId;
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

  return (
    <MainLayout>
      {/* Hero Section */}
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
            {/* Filter Form */}
            <div className="max-w-2xl mx-auto">
              <MiniOnboardingForm onFilter={handleFilter} />
            </div>

            {/* Active Filters Info */}
            {hasActiveFilters && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" />
                <span>
                  {t?.vacancies?.showingOffers || 'Showing offers'}
                  {filters.targetCountry && ` ${t?.vacancies?.in || 'in'} ${getCountryDisplayName(filters.targetCountry)}`}
                  {filters.profession && ` ${t?.vacancies?.for || 'for'} ${filters.profession === 'doctor' ? (t?.wizard?.doctorType?.general || 'doctors') : filters.profession === 'nurse' ? (t?.wizard?.doctorType?.nurse || 'nurses') : filters.profession}`}
                </span>
              </div>
            )}

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
                      specialty={job.specialty}
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

            {/* Homologation CTA */}
            <div className="max-w-md mx-auto">
              <HomologationPlanPanel />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default VacanciesConversion;
