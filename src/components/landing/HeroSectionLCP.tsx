
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/hooks/useLanguage';

// Optimized Hero Section for LCP performance
// Removes animations, complex state, and unnecessary re-renders
const HeroSectionLCP = React.memo(() => {
  const { t } = useLanguage();
  
  // Simple static content - no rotating phrases for better LCP
  const heroData = {
    title: t?.hero?.title || "Where Doctors and Clinics Connect",
    subtitle: t?.hero?.subtitle || "Digital platform where hospitals meet pre-vetted doctors and nurses directly",
    findJob: t?.hero?.findJob || "Find a job",
    findTalent: t?.hero?.findTalent || "Find a Talent"
  };
  
  return (
    <section className="hero-section">
      <div className="hero-gradient" />
      <div className="container hero-content">
        <div className="hero-inner no-layout-shift">
          <h1 className="hero-title">
            {heroData.title} <span className="text-primary font-medium">no agencies</span>
          </h1>
          <p className="hero-subtitle">
            {heroData.subtitle}
          </p>
          <div className="hero-buttons">
            <Button size="lg" asChild className="btn btn-primary">
              <Link to="/signup" rel="prefetch">{heroData.findJob}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="btn btn-outline">
              <Link to="/signup" rel="prefetch">{heroData.findTalent}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSectionLCP.displayName = 'HeroSectionLCP';

export default HeroSectionLCP;
