
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/hooks/useLanguage';

const HeroSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative overflow-hidden">
      <div className="hero-gradient absolute inset-0 opacity-20" />
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold tracking-tight">
            {t?.forDoctors?.hero?.title || "Your journey to working as a doctor in Germany or Austria starts here"}
          </h1>
          <p className="text-lg md:text-xl lg:text-[22px] text-muted-foreground">
            {t?.forDoctors?.hero?.subtitle || "Solvia is the digital platform that simplifies your journey: recognition, language, job, and relocation—all in one place."}
          </p>
          <div className="flex flex-col items-center mt-8">
            <Button size="lg" asChild>
              <Link to="/signup">{t?.forDoctors?.hero?.cta || "Sign up now for free"}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
