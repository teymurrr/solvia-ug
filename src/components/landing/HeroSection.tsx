
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/hooks/useLanguage';

// Static fallback content to prevent render delays
const STATIC_HERO_CONTENT = {
  title: "Where Doctors and Clinics Connect",
  subtitle: "Digital platform where hospitals meet pre-vetted doctors and nurses directly",
  findJob: "Find a job",
  findTalent: "Find a Talent",
  rotatingPhrases: ["no agencies", "no hidden fees", "no delays"]
};

const HeroSection = React.memo(() => {
  const { t } = useLanguage();
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Memoize translations with proper fallbacks to prevent "Render Delay"
  const heroData = useMemo(() => {
    // Use static content immediately if translations aren't ready
    if (!t || !t.hero) {
      return STATIC_HERO_CONTENT;
    }
    
    return {
      rotatingPhrases: t.hero.rotatingPhrases || STATIC_HERO_CONTENT.rotatingPhrases,
      title: t.hero.title || STATIC_HERO_CONTENT.title,
      subtitle: t.hero.subtitle || STATIC_HERO_CONTENT.subtitle,
      findJob: t.hero.findJob || STATIC_HERO_CONTENT.findJob,
      findTalent: t.hero.findTalent || STATIC_HERO_CONTENT.findTalent
    };
  }, [t]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % heroData.rotatingPhrases.length);
        setIsAnimating(false);
      }, 500);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [heroData.rotatingPhrases.length]);
  
  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold tracking-tight">
            {heroData.title} <span 
              className={`phrase-rotate font-medium text-primary ${isAnimating ? 'fade-out-up' : 'fade-in-down'}`}
              style={{ contain: 'layout' }}
            >
              {heroData.rotatingPhrases[currentPhraseIndex]}
            </span>
          </h1>
          <p className="text-lg md:text-xl lg:text-[22px] text-muted-foreground">
            {heroData.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" asChild>
              <Link to="/signup" rel="prefetch">{heroData.findJob}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/signup" rel="prefetch">{heroData.findTalent}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
