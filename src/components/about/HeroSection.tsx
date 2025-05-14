
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

const HeroSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl font-bold">{t.about.hero.title}</h1>
          <p className="text-xl text-muted-foreground">
            {t.about.hero.subtitle}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
