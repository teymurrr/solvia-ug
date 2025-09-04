
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/hooks/useLanguage';

const HeroSection = React.memo(() => {
  const { t } = useLanguage();
  
  // Memoize translations to prevent unnecessary recalculations
  const heroData = useMemo(() => ({
    title: t?.hero?.title || "Your new job in European Healthcare awaits you.",
    subtitle: t?.hero?.subtitle || "Solvia helps you get your licence, learn the language and find a job - all in one platform.",
    cta: t?.hero?.cta || "Sign up now for free"
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
          <div className="flex flex-col items-center space-y-3 mt-6">
            <Button size="lg" asChild>
              <Link to="/signup" rel="prefetch">{heroData.cta}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
