
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="hero-gradient absolute inset-0 opacity-20" />
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Global Healthcare Recruitment, <span className="text-gradient">Simplified</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Connecting qualified medical professionals with hospitals and clinics in need of talent worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" asChild>
              <Link to="/professionals">Find Job</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/institutions">Find Talents</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
