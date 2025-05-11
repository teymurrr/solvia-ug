
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
      
      // Change phrase after animation starts
      setTimeout(() => {
        setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % rotatingPhrases.length);
        setIsAnimating(false);
      }, 500); // Half a second for the exit animation
      
    }, 3000); // Change every 3 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="relative overflow-hidden">
      <div className="hero-gradient absolute inset-0 opacity-20" />
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto">
          {/* Left side with title */}
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-left">
              {title}
            </h1>
          </div>
          
          {/* Right side with rotating phrases */}
          <div className="md:w-1/2">
            <div className="h-20 flex items-center justify-center md:justify-start overflow-hidden"> 
              <p 
                className={`shimmer-gradient text-3xl md:text-4xl lg:text-5xl font-bold transform transition-all duration-500 ${
                  isAnimating ? "opacity-0 -translate-y-8" : "opacity-100 translate-y-0"
                }`}
              >
                {rotatingPhrases[currentPhraseIndex]}
              </p>
            </div>
          </div>
        </div>
        
        {/* Subtitle and buttons */}
        <div className="max-w-3xl mx-auto text-center mt-8">
          <p className="text-lg md:text-xl lg:text-[22px] text-muted-foreground mb-8">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
