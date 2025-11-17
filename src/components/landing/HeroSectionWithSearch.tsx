import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Briefcase, Award } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const HeroSectionWithSearch = React.memo(() => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Memoize translations to prevent unnecessary recalculations
  const heroData = useMemo(() => ({
    title: t?.hero?.title || 'Your new job in European Healthcare awaits you.',
    subtitle: t?.hero?.subtitle || 'Solvia helps you get your licence, learn the language and find a job.',
    cta: t?.hero?.cta || 'Sign up now for free',
    learnMore: t?.hero?.learnMore || 'Learn More',
    searchPlaceholder: t?.hero?.searchPlaceholder || 'Job title, specialty, or keyword...',
    locationPlaceholder: t?.hero?.locationPlaceholder || 'Location...',
    searchButton: t?.hero?.searchButton || 'Search Jobs',
    popularSearches: t?.hero?.popularSearches || 'Popular searches:',
    searchTerms: {
      nurse: t?.hero?.searchTerms?.nurse || 'Nurse',
      doctor: t?.hero?.searchTerms?.doctor || 'Doctor',
      physiotherapist: t?.hero?.searchTerms?.physiotherapist || 'Physiotherapist',
      dentist: t?.hero?.searchTerms?.dentist || 'Dentist',
      pharmacist: t?.hero?.searchTerms?.pharmacist || 'Pharmacist'
    },
    socialProof: {
      professionalsHelped: t?.hero?.socialProof?.professionalsHelped || "1000+ professionals helped",
      successRate: t?.hero?.socialProof?.successRate || "95% success rate"
    },
    pathCards: {
      jobs: {
        title: t?.hero?.pathCards?.jobs?.title || 'Find Your Dream Job',
        subtitle: t?.hero?.pathCards?.jobs?.subtitle || 'Search thousands of healthcare positions across Europe',
        searchCta: t?.hero?.pathCards?.jobs?.searchCta || 'Search Jobs'
      },
      homologation: {
        title: t?.hero?.pathCards?.homologation?.title || 'Get Your License Recognized',
        subtitle: t?.hero?.pathCards?.homologation?.subtitle || 'Fast-track your diploma certification process',
        cta: t?.hero?.pathCards?.homologation?.cta || 'Start Certification',
        badge: t?.hero?.pathCards?.homologation?.badge || 'Expert guidance'
      }
    }
  }), [t]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to vacancies page with search parameters
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    navigate(`/vacancies?${params.toString()}`);
  };

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <section className="relative overflow-hidden">
      <div className="hero-gradient absolute inset-0 opacity-20" />
      <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            {heroData.title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {heroData.subtitle}
          </p>
          
          {/* Dual Path Cards */}
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 mt-12">
            {/* Job Search Card */}
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {heroData.pathCards.jobs.title}
                  </h3>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-6">
                {heroData.pathCards.jobs.subtitle}
              </p>
              
              <form onSubmit={handleSearch} className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder={heroData.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 bg-background"
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-base">
                  {heroData.pathCards.jobs.searchCta}
                </Button>
              </form>

              {/* Popular Searches */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3">
                  {heroData.popularSearches}
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.values(heroData.searchTerms).map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        navigate(`/vacancies?search=${encodeURIComponent(term)}`);
                      }}
                      className="px-3 py-1.5 text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* License Recognition Card */}
            <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {heroData.pathCards.homologation.title}
                  </h3>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-8">
                {heroData.pathCards.homologation.subtitle}
              </p>

              <Button
                onClick={() => navigate('/homologation-payment')}
                className="w-full h-12 text-base"
                variant="default"
              >
                {heroData.pathCards.homologation.cta}
              </Button>
            </div>
          </div>
            
            {/* Social proof */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground mt-12">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  <img 
                    src="/lovable-uploads/fb51f001-5b4c-4c12-9bff-ec7776fda396.png" 
                    alt="Professional 1" 
                    className="w-8 h-8 rounded-full border-2 border-background object-cover"
                  />
                  <img 
                    src="/lovable-uploads/cc32bcf9-0674-4d4f-9316-3ce0790f675e.png" 
                    alt="Professional 2" 
                    className="w-8 h-8 rounded-full border-2 border-background object-cover"
                  />
                  <img 
                    src="/lovable-uploads/5f708227-020b-4f86-ae6e-6ad00443ec94.png" 
                    alt="Professional 3" 
                    className="w-8 h-8 rounded-full border-2 border-background object-cover"
                  />
                </div>
                <span>{heroData.socialProof.professionalsHelped}</span>
              </div>
              <div className="text-muted-foreground">•</div>
              <span>{heroData.socialProof.successRate}</span>
            </div>
        </div>
      </div>
    </section>
  );
});

HeroSectionWithSearch.displayName = 'HeroSectionWithSearch';

export default HeroSectionWithSearch;