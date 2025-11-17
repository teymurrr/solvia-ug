import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/hooks/useLanguage';

const HeroSectionWithSearch = React.memo(() => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
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
        searchCta: t?.hero?.pathCards?.jobs?.searchCta || 'Search Jobs',
        badge: t?.hero?.pathCards?.jobs?.badge || 'Already certified?'
      },
      homologation: {
        title: t?.hero?.pathCards?.homologation?.title || 'Get Your License Recognized',
        subtitle: t?.hero?.pathCards?.homologation?.subtitle || 'Fast-track your diploma certification process',
        cta: t?.hero?.pathCards?.homologation?.cta || 'Start Certification',
        badge: t?.hero?.pathCards?.homologation?.badge || 'New to Europe?'
      }
    }
  }), [t]);

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background"></div>
      
      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
        {/* Hero Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in">
            {heroData.title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12">
            {heroData.subtitle}
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => navigate('/homologation-payment')}
              size="lg"
              className="w-full sm:w-auto px-8 h-14 text-lg font-semibold hover:scale-105 transition-transform"
            >
              {heroData.pathCards.homologation.cta}
            </Button>
            <Button
              onClick={() => navigate('/vacancies')}
              size="lg"
              variant="outline"
              className="w-full sm:w-auto px-8 h-14 text-lg font-semibold hover:scale-105 transition-transform"
            >
              {heroData.pathCards.jobs.searchCta}
            </Button>
          </div>
        </div>

        {/* Social Proof */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground mt-20">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <img 
                src="/lovable-uploads/fb51f001-5b4c-4c12-9bff-ec7776fda396.png" 
                alt="Professional 1" 
                className="w-10 h-10 rounded-full border-2 border-background object-cover"
              />
              <img 
                src="/lovable-uploads/cc32bcf9-0674-4d4f-9316-3ce0790f675e.png" 
                alt="Professional 2" 
                className="w-10 h-10 rounded-full border-2 border-background object-cover"
              />
              <img 
                src="/lovable-uploads/5f708227-020b-4f86-ae6e-6ad00443ec94.png" 
                alt="Professional 3" 
                className="w-10 h-10 rounded-full border-2 border-background object-cover"
              />
            </div>
            <span className="font-medium">{heroData.socialProof.professionalsHelped}</span>
          </div>
          <div className="text-muted-foreground/40">•</div>
          <span className="font-medium">{heroData.socialProof.successRate}</span>
        </div>
      </div>
    </section>
  );
});

HeroSectionWithSearch.displayName = 'HeroSectionWithSearch';

export default HeroSectionWithSearch;