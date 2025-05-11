
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/hooks/useLanguage';

const HeroSection = () => {
  const { t } = useLanguage();
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const rotatingPhrases = ["no agencies", "no hidden fees", "no delays"];
  
  // Default values in case translations aren't loaded yet
  const title = t?.hero?.title || "Where Doctors and Clinics Connect";
  const subtitle = t?.hero?.subtitle || "digital platform where hospitals meet pre-vetted doctors and nurses directly";
  const findJob = t?.hero?.findJob || "Find a job";
  const findTalent = t?.hero?.findTalent || "Find a Talent";
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % rotatingPhrases.length);
        setIsAnimating(false);
      }, 500); // Wait for exit animation to complete before changing the phrase
    }, 3000); // Change every 3 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="relative overflow-hidden">
      <div className="hero-gradient absolute inset-0 opacity-20" />
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold tracking-tight">
            {title} <span className={`phrase-rotate font-extrabold text-primary ${isAnimating ? 'fade-out-up' : 'fade-in-down'}`}>{rotatingPhrases[currentPhraseIndex]}</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-[22px] text-muted-foreground">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" asChild>
              <Link to="/signup/professional">{findJob}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/signup/institution">{findTalent}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
