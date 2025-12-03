
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/hooks/useLanguage';

const HeroSection = React.memo(() => {
  const { t } = useLanguage();
  
  // Memoize translations to prevent unnecessary recalculations
  const heroData = useMemo(() => ({
    title: t?.hero?.title || "Find work in Europe as a doctor or nurse. We guide you through the homologation.",
    subtitle: t?.hero?.subtitle || "See job offers by country and get a clear plan to work in Germany, Austria, Spain, Italy or France.",
    cta: t?.hero?.cta || "See offers for my profile",
    secondaryCta: t?.hero?.secondaryCta || "Get my free homologation plan"
  }), [t]);
  
  return (
    <section className="relative overflow-hidden">
      <div className="hero-gradient absolute inset-0 opacity-20" />
      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            {heroData.title}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            {heroData.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <Button size="lg" asChild>
              <Link to="/vacancies" rel="prefetch">{heroData.cta}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/homologation-wizard" rel="prefetch">{heroData.secondaryCta}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
