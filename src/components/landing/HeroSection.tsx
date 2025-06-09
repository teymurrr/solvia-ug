
import React from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/hooks/useLanguage';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroSection = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  const heroData = {
    title: t?.hero?.title || "Find Your Dream Medical Job or Perfect Candidate",
    subtitle: t?.hero?.subtitle || "Connecting qualified medical professionals with hospitals and clinics worldwide",
    cta: {
      professionals: t?.hero?.cta?.professionals || "Find Opportunities",
      employers: t?.hero?.cta?.employers || "Find Talent"
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center">
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main title - no animations on mobile */}
          <h1 
            className={`text-[32px] sm:text-[42px] lg:text-[52px] font-bold text-gray-900 leading-tight mb-6 ${
              !isMobile ? 'animate-fade-in' : ''
            }`}
            style={{ contain: 'layout style' }}
          >
            {heroData.title}
          </h1>
          
          {/* Subtitle - no animations on mobile */}
          <p 
            className={`text-[16px] sm:text-[18px] lg:text-[20px] text-gray-600 mb-8 max-w-2xl mx-auto ${
              !isMobile ? 'animate-fade-in' : ''
            }`}
            style={!isMobile ? { animationDelay: '0.2s', animationFillMode: 'both' } : {}}
          >
            {heroData.subtitle}
          </p>
          
          {/* CTA Buttons - no animations on mobile */}
          <div 
            className={`flex flex-col sm:flex-row gap-4 justify-center ${
              !isMobile ? 'animate-fade-in' : ''
            }`}
            style={!isMobile ? { animationDelay: '0.4s', animationFillMode: 'both' } : {}}
          >
            <Button asChild size="lg" className="px-8">
              <Link to="/professionals">{heroData.cta.professionals}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link to="/employers">{heroData.cta.employers}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
