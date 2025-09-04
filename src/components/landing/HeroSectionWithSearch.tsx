import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Briefcase } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const HeroSectionWithSearch = React.memo(() => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  
  // Memoize translations to prevent unnecessary recalculations
  const heroData = useMemo(() => ({
    title: t?.hero?.title || "Your new job in European Healthcare awaits you.",
    subtitle: t?.hero?.subtitle || "Solvia helps you get your licence, learn the language and find a job - all in one platform.",
    cta: t?.hero?.cta || "Sign up now for free"
  }), [t]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to vacancies page with search parameters
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (location) params.set('location', location);
    navigate(`/vacancies?${params.toString()}`);
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
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mt-12">
            <form onSubmit={handleSearch} className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-border/50 p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Job Title/Specialty Input */}
                <div className="relative flex-1">
                  <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Job title, specialty, or keyword..."
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
                    placeholder="Location..."
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
                  Search Jobs
                </Button>
              </div>
              
              {/* Popular searches */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">Popular searches:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Nurse', 'Doctor', 'Physiotherapist', 'Dentist', 'Pharmacist'].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setSearchQuery(term)}
                      className="px-4 py-2 text-sm bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>

          <div className="flex flex-col items-center space-y-6 mt-12">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="text-lg px-8 py-4">
                <Link to="/signup" rel="prefetch">{heroData.cta}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4">
                <Link to="/for-doctors">Learn More</Link>
              </Button>
            </div>
            
            {/* Social proof */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-background"></div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-background"></div>
                  <div className="w-8 h-8 bg-purple-500 rounded-full border-2 background"></div>
                </div>
                <span>5,000+ professionals helped</span>
              </div>
              <div className="text-muted-foreground">•</div>
              <span>95% success rate</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSectionWithSearch.displayName = 'HeroSectionWithSearch';

export default HeroSectionWithSearch;