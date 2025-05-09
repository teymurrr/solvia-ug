
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/hooks/useLanguage';

const HeroSection = () => {
  const { t } = useLanguage();
  
  // Default values in case translations aren't loaded yet
  const title = t?.hero?.title || "Global Healthcare Recruitment, Simplified";
  const subtitle = t?.hero?.subtitle || "Connecting qualified medical professionals with hospitals and clinics in need of talent worldwide.";
  const findJob = t?.hero?.findJob || "Find a job";
  const findTalent = t?.hero?.findTalent || "Find a Talent";
  
  // Split title for styling if it exists and contains a comma
  const titleParts = title.split(', ');
  const firstTitlePart = titleParts[0] || "";
  const secondTitlePart = titleParts.length > 1 ? titleParts[1] : "";
  
  return (
    <section className="relative overflow-hidden">
      <div className="hero-gradient absolute inset-0 opacity-20" />
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold tracking-tight">
            {firstTitlePart}{secondTitlePart ? ', ' : ''}<span className="shimmer-gradient">{secondTitlePart}</span>
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
