import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import heroBackground from '@/assets/hero-medical-team.jpg';

const HeroSectionWithSearch = React.memo(() => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const trustItems = [
    t.hero.trustItems?.digital || "100% digital process",
    t.hero.trustItems?.countries || "Multiple European countries available",
    t.hero.trustItems?.support || "Step-by-step guidance"
  ];

  const stats = [
    { number: "5", label: t.hero.stats?.countries || "Countries available" },
    { number: "200+", label: t.hero.stats?.homologations || "Open positions" },
    { number: "2", label: t.hero.stats?.accelerators || "Accelerator partners" },
    { number: "100%", label: t.hero.stats?.digital || "Digital process" }
  ];
  
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-center -mt-16 pt-16">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        {/* Overlay for text readability - subtle background */}
        <div className="absolute inset-0 bg-background/60" />
        <div className="container mx-auto px-4 py-24 md:py-32 lg:py-40 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
              {t.hero.title}
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t.hero.subtitle}
            </p>
            
            {/* Trust line */}
            <p className="text-sm text-foreground/70 font-medium">
              {trustItems.join(' • ')}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Button 
                size="lg" 
                className="h-14 px-10 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/homologation-wizard')}
              >
                {t.hero.cta} →
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="h-14 px-10 text-lg font-semibold"
                onClick={() => navigate('/vacancies')}
              >
                {t.hero.secondaryCta}
              </Button>
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
