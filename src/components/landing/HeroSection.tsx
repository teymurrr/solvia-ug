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
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold tracking-tight">
            {t.hero.title.split(', ')[0]}, <span className="text-gradient">{t.hero.title.split(', ')[1]}</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-[22px] text-muted-foreground">
            {t.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" className="px-8 py-6 text-lg h-auto" asChild>
              <Link to="/signup/professional">{t.hero.findJob}</Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg h-auto" asChild>
              <Link to="/signup/institution">{t.hero.findTalent}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
