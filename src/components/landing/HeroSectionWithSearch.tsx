import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Briefcase } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const HeroSectionWithSearch = React.memo(() => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  
  // Memoize translations to prevent unnecessary recalculations
  const heroData = useMemo(() => ({
    title: t?.hero?.title || "Your new job in European Healthcare awaits you.",
    subtitle: t?.hero?.subtitle || "Solvia helps you get your licence, learn the language and find a job - all in one platform.",
    cta: t?.hero?.cta || "Sign up now for free",
    learnMore: t?.hero?.learnMore || "Learn More",
    searchPlaceholder: t?.hero?.searchPlaceholder || "Job title, specialty, or keyword...",
    locationPlaceholder: t?.hero?.locationPlaceholder || "Location...",
    searchButton: t?.hero?.searchButton || "Search Jobs",
    popularSearches: t?.hero?.popularSearches || "Popular searches:",
    searchTerms: t?.hero?.searchTerms || {
      nurse: 'Nurse',
      doctor: 'Doctor', 
      physiotherapist: 'Physiotherapist',
      dentist: 'Dentist',
      pharmacist: 'Pharmacist'
    },
    socialProof: {
      professionalsHelped: t?.hero?.socialProof?.professionalsHelped || "1000+ professionals helped",
      successRate: t?.hero?.socialProof?.successRate || "95% success rate"
    }
  }), [t]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggedIn) {
      // Navigate to vacancies page with search parameters
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (location) params.set('location', location);
      navigate(`/vacancies?${params.toString()}`);
    } else {
      // Show friendly message encouraging signup
      const friendlyMessages = {
        en: {
          title: "Ready to explore opportunities? 🚀",
          description: "Join thousands of healthcare professionals who found their dream job with Solvia!"
        },
        es: {
          title: "¿Listo para explorar oportunidades? 🚀", 
          description: "¡Únete a miles de profesionales sanitarios que encontraron su trabajo ideal con Solvia!"
        },
        de: {
          title: "Bereit, Möglichkeiten zu erkunden? 🚀",
          description: "Schließen Sie sich Tausenden von Gesundheitsfachkräften an, die mit Solvia ihren Traumjob gefunden haben!"
        },
        fr: {
          title: "Prêt à explorer les opportunités? 🚀",
          description: "Rejoignez des milliers de professionnels de santé qui ont trouvé leur emploi idéal avec Solvia!"
        },
        ru: {
          title: "Готовы исследовать возможности? 🚀",
          description: "Присоединяйтесь к тысячам медицинских специалистов, которые нашли работу мечты с Solvia!"
        }
      };
      
      const currentLang = t?.hero?.title ? 
        (t.hero.title.includes('European Healthcare') ? 'en' :
         t.hero.title.includes('sistema sanitario europeo') ? 'es' :
         t.hero.title.includes('europäischen Gesundheitswesen') ? 'de' :
         t.hero.title.includes('système de santé européen') ? 'fr' :
         t.hero.title.includes('европейской медицине') ? 'ru' : 'en') : 'en';
      
      const message = friendlyMessages[currentLang as keyof typeof friendlyMessages];
      
      toast({
        title: message.title,
        description: message.description,
        duration: 5000,
      });
      
      navigate('/signup');
    }
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
          
          <div className="max-w-4xl mx-auto mt-12">
            <form onSubmit={handleSearch} className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-border/50 p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Job Title/Specialty Input */}
                <div className="relative flex-1">
                  <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={heroData.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-lg border-0 bg-background/50 focus:bg-background transition-colors"
                  />
                </div>
                
                {/* Location Input */}
                <div className="relative flex-1 md:flex-initial md:w-64">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={heroData.locationPlaceholder}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-12 h-14 text-lg border-0 bg-background/50 focus:bg-background transition-colors"
                  />
                </div>
                
                {/* Search Button */}
                <Button 
                  type="submit"
                  size="lg" 
                  className="h-14 px-8 text-lg group"
                >
                  <Search className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  {heroData.searchButton}
                </Button>
              </div>
              
              {/* Popular searches */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">{heroData.popularSearches}</p>
                <div className="flex flex-wrap justify-center gap-2">
                   {Object.entries(heroData.searchTerms).map(([key, term]) => (
                     <button
                       key={key}
                       type="button"
                       onClick={() => setSearchQuery(String(term))}
                       className="px-4 py-2 text-sm bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                     >
                       {String(term)}
                     </button>
                   ))}
                </div>
              </div>
            </form>
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