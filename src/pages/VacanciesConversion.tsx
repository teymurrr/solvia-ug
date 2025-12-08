import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import BlurredJobCard from '@/components/vacancies/BlurredJobCard';
import MiniOnboardingForm, { OnboardingData } from '@/components/vacancies/MiniOnboardingForm';
import CountryComparisonBar from '@/components/vacancies/CountryComparisonBar';
import HomologationPlanPanel from '@/components/vacancies/HomologationPlanPanel';
import UnlockedJobCard from '@/components/vacancies/UnlockedJobCard';
import { useVacancies } from '@/hooks/useVacancies';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Lock, Sparkles } from 'lucide-react';

// Mock blurred job data for the locked state
const mockBlurredJobs = [
  { hospital: 'Hospital Universitario de Hamburgo', specialty: 'Pediatría', city: 'Hamburgo', country: 'Alemania', salaryRange: '52.000 - 60.000 €/año' },
  { hospital: 'Charité Berlin', specialty: 'Cardiología', city: 'Berlín', country: 'Alemania', salaryRange: '58.000 - 72.000 €/año' },
  { hospital: 'Klinikum München', specialty: 'Cirugía General', city: 'Múnich', country: 'Alemania', salaryRange: '55.000 - 68.000 €/año' },
  { hospital: 'AKH Wien', specialty: 'Neurología', city: 'Viena', country: 'Austria', salaryRange: '60.000 - 75.000 €/año' },
  { hospital: 'Hospital Clínic Barcelona', specialty: 'Medicina Interna', city: 'Barcelona', country: 'España', salaryRange: '42.000 - 52.000 €/año' },
  { hospital: 'Universitätsklinikum Frankfurt', specialty: 'Anestesiología', city: 'Frankfurt', country: 'Alemania', salaryRange: '54.000 - 65.000 €/año' },
];

const VacanciesConversion = () => {
  const { vacancies, loading } = useVacancies();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [userProfile, setUserProfile] = useState<OnboardingData | null>(null);
  const [savedVacancies, setSavedVacancies] = useState<string[]>([]);

  // Check if user has already completed onboarding (from localStorage)
  useEffect(() => {
    const savedProfile = localStorage.getItem('vacancies_profile');
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
        setIsUnlocked(true);
      } catch (e) {
        // Invalid data, ignore
      }
    }
  }, []);

  const handleOnboardingComplete = (data: OnboardingData) => {
    setUserProfile(data);
    setIsUnlocked(true);
    localStorage.setItem('vacancies_profile', JSON.stringify(data));
  };

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
              {isUnlocked 
                ? 'Ofertas que coinciden con tu perfil' 
                : 'Trabaja en Europa: oportunidades según tu especialidad'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {isUnlocked 
                ? `Encontramos ${vacancies.length}+ ofertas para ${userProfile?.profession === 'doctor' ? 'médicos' : 'profesionales de salud'}`
                : 'Completa tu perfil para ver ofertas personalizadas con salarios y requisitos'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {!isUnlocked ? (
            /* LOCKED STATE */
            <div className="space-y-8">
              {/* Mini Onboarding Form - Prominently placed */}
              <div className="max-w-2xl mx-auto">
                <MiniOnboardingForm onComplete={handleOnboardingComplete} />
              </div>

              {/* Blurred Job Cards Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <span className="text-sm">Vista previa de ofertas disponibles</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockBlurredJobs.map((job, index) => (
                    <BlurredJobCard
                      key={index}
                      hospital={job.hospital}
                      specialty={job.specialty}
                      city={job.city}
                      country={job.country}
                      salaryRange={job.salaryRange}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* UNLOCKED STATE - Full Dashboard */
            <div className="space-y-8">
              {/* Country Comparison Bar */}
              <CountryComparisonBar 
                profession={userProfile?.profession}
                specialty={userProfile?.specialty}
              />

              {/* Main Content Grid */}
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Job Feed */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h2 className="font-semibold text-lg">Ofertas personalizadas</h2>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {vacancies.length} ofertas disponibles
                    </span>
                  </div>

                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="border rounded-lg p-6">
                          <Skeleton className="h-6 w-3/4 mb-4" />
                          <Skeleton className="h-4 w-1/2 mb-2" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {vacancies.slice(0, 10).map((vacancy) => (
                        <UnlockedJobCard
                          key={vacancy.id}
                          id={vacancy.id}
                          title={vacancy.title}
                          hospital={vacancy.institution}
                          city={vacancy.city || vacancy.location}
                          country={vacancy.country || 'Alemania'}
                          department={vacancy.department}
                          salary={vacancy.salary || undefined}
                          requirements={vacancy.requirements || []}
                          contractType={vacancy.contract_type}
                          postedDate={formatDate(vacancy.posted_date)}
                          onSave={toggleSaveVacancy}
                          isSaved={savedVacancies.includes(vacancy.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Panel - Homologation Plan */}
                <div className="lg:w-80">
                  <HomologationPlanPanel />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default VacanciesConversion;
