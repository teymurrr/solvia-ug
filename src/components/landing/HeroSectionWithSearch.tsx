import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import heroBackground from '@/assets/hero-background.png';

const HeroSectionWithSearch = React.memo(() => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const trustItems = [
    t.hero.trustItems?.digital || "100% digital process",
    t.hero.trustItems?.countries || "Multiple European countries available",
    t.hero.trustItems?.support || "Step-by-step guidance"
  ];

  const stats = [
    { number: "+500", label: t.hero.stats?.professionals || "Registered professionals" },
    { number: "+200", label: t.hero.stats?.homologations || "Homologations in progress" },
    { number: "5", label: t.hero.stats?.countries || "Countries available" },
    { number: "92%", label: t.hero.stats?.satisfaction || "User satisfaction" }
  ];
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50" />
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
              {t.hero.title}
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t.hero.subtitle}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button 
                size="lg" 
                className="h-14 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/vacancies')}
              >
                {t.hero.cta} →
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-14 px-8 text-lg font-semibold border-2 hover:bg-primary/5 transition-all duration-300"
                onClick={() => navigate('/country-selection')}
              >
                {t.hero.secondaryCta}
              </Button>
            </div>
            
            {/* Trust Items */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-6">
              {trustItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-muted/50 border-y border-border/50">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
});

HeroSectionWithSearch.displayName = 'HeroSectionWithSearch';

export default HeroSectionWithSearch;
