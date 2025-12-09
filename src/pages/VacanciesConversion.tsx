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

// Mock blurred job data for the locked state
const mockBlurredJobs = [
  { hospital: 'Hospital Universitario de Hamburgo', specialty: 'Pediatría', city: 'Hamburgo', country: 'germany', salaryRange: '52.000 - 60.000 €/año' },
  { hospital: 'Charité Berlin', specialty: 'Cardiología', city: 'Berlín', country: 'germany', salaryRange: '58.000 - 72.000 €/año' },
  { hospital: 'Klinikum München', specialty: 'Cirugía General', city: 'Múnich', country: 'germany', salaryRange: '55.000 - 68.000 €/año' },
  { hospital: 'AKH Wien', specialty: 'Neurología', city: 'Viena', country: 'austria', salaryRange: '60.000 - 75.000 €/año' },
  { hospital: 'Hospital Clínic Barcelona', specialty: 'Medicina Interna', city: 'Barcelona', country: 'spain', salaryRange: '42.000 - 52.000 €/año' },
  { hospital: 'Hôpital Universitaire Lyon', specialty: 'Anestesiología', city: 'Lyon', country: 'france', salaryRange: '54.000 - 65.000 €/año' },
];

const countryDisplayNames: Record<string, string> = {
  germany: 'Alemania',
  austria: 'Austria',
  spain: 'España',
  france: 'Francia'
};

const VacanciesConversion = () => {
  const { vacancies, loading } = useVacancies();
  const [filters, setFilters] = useState<FilterData>({ profession: '', targetCountry: '' });
  const [savedVacancies, setSavedVacancies] = useState<string[]>([]);

  const handleFilter = (newFilters: FilterData) => {
    setFilters(newFilters);
  };

  // Filter blurred jobs based on selected country
  const filteredBlurredJobs = useMemo(() => {
    if (!filters.targetCountry) return mockBlurredJobs;
    return mockBlurredJobs.filter(job => 
      job.country.toLowerCase() === filters.targetCountry.toLowerCase()
    );
  }, [filters.targetCountry]);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
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
              Ofertas verificadas
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold">
              Trabaja en Europa: oportunidades según tu especialidad
            </h1>
            <p className="text-lg text-muted-foreground">
              Filtra por profesión y país para ver ofertas relevantes
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
                  Mostrando ofertas
                  {filters.targetCountry && ` en ${countryDisplayNames[filters.targetCountry] || filters.targetCountry}`}
                  {filters.profession && ` para ${filters.profession === 'doctor' ? 'médicos' : filters.profession === 'nurse' ? 'enfermeros' : filters.profession}`}
                </span>
              </div>
            )}

            {/* Job Cards Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span className="text-sm">Vista previa de ofertas disponibles ({filteredBlurredJobs.length})</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBlurredJobs.length > 0 ? (
                  filteredBlurredJobs.map((job, index) => (
                    <BlurredJobCard
                      key={index}
                      hospital={job.hospital}
                      specialty={job.specialty}
                      city={job.city}
                      country={countryDisplayNames[job.country] || job.country}
                      salaryRange={job.salaryRange}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    <p>No hay ofertas disponibles para los filtros seleccionados.</p>
                    <p className="text-sm mt-2">Prueba con otros filtros o limpia la búsqueda.</p>
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
