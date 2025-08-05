
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/hooks/useLanguage';

const HeroSection = React.memo(() => {
  const { t } = useLanguage();
  
  // Memoize translations to prevent unnecessary recalculations
  const heroData = useMemo(() => ({
    title: t?.hero?.title || "Work as a Medical Professional in Germany or Austria",
    subtitle: t?.hero?.subtitle || "Solvia helps international doctors, nurses, and other medical professionals get licensed, improve their German, and secure jobs—step by step, in one platform.",
    cta: t?.hero?.cta || "Start My Journey",
    supportText: t?.hero?.supportText || "Free to start | Personalized support | Guidance in multiple languages"
  }), [t]);
  
  return (
    <section className="relative overflow-hidden">
      <div className="hero-gradient absolute inset-0 opacity-20" />
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold tracking-tight">
            {heroData.title}
          </h1>
          <p className="text-lg md:text-xl lg:text-[22px] text-muted-foreground max-w-3xl mx-auto">
            {heroData.subtitle}
          </p>
          <div className="flex flex-col items-center space-y-4 mt-8">
            <Button size="lg" asChild>
              <Link to="/signup" rel="prefetch">{heroData.cta}</Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              {heroData.supportText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
