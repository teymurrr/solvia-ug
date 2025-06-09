
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/hooks/useLanguage';

const HeroSectionOptimized = React.memo(() => {
  const { t } = useLanguage();
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Memoize translations to prevent unnecessary recalculations
  const heroData = useMemo(() => ({
    rotatingPhrases: t?.hero?.rotatingPhrases ?? ["no agencies", "no hidden fees", "no delays"],
    title: t?.hero?.title || "Where Doctors and Clinics Connect",
    subtitle: t?.hero?.subtitle || "Digital platform where hospitals meet pre-vetted doctors and nurses directly",
    findJob: t?.hero?.findJob || "Find a job",
    findTalent: t?.hero?.findTalent || "Find a Talent"
  }), [t]);
  
  // Optimized phrase rotation with proper cleanup
  const rotatePhrases = useCallback(() => {
    setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % heroData.rotatingPhrases.length);
  }, [heroData.rotatingPhrases.length]);
  
  useEffect(() => {
    // Clear any existing timers
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    // Set up rotation only if we have phrases
    if (heroData.rotatingPhrases.length > 1) {
      intervalRef.current = setInterval(rotatePhrases, 3000);
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [rotatePhrases, heroData.rotatingPhrases.length]);
  
  // Memoize button components to prevent re-renders
  const findJobButton = useMemo(() => (
    <Button size="lg" asChild>
      <Link to="/signup" rel="prefetch">{heroData.findJob}</Link>
    </Button>
  ), [heroData.findJob]);
  
  const findTalentButton = useMemo(() => (
    <Button size="lg" variant="outline" asChild>
      <Link to="/signup" rel="prefetch">{heroData.findTalent}</Link>
    </Button>
  ), [heroData.findTalent]);
  
  return (
    <section className="relative overflow-hidden">
      <div className="hero-gradient absolute inset-0 opacity-20" />
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-4 md:space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[72px] font-bold tracking-tight leading-tight">
            {heroData.title}{' '}
            <span 
              className="text-primary transition-opacity duration-300 ease-in-out"
              style={{ contain: 'layout' }}
              key={currentPhraseIndex}
            >
              {heroData.rotatingPhrases[currentPhraseIndex]}
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-[22px] text-muted-foreground max-w-2xl mx-auto">
            {heroData.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mt-6 md:mt-8">
            {findJobButton}
            {findTalentButton}
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSectionOptimized.displayName = 'HeroSectionOptimized';

export default HeroSectionOptimized;
