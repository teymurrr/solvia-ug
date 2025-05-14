
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

const CTASection = () => {
  const { t } = useLanguage();
  
  // Default values in case translations are not available
  const joinUsText = t?.about?.joinUs || "Join Us";

  return (
    <section className="py-16 bg-medical-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">
          {t?.cta?.title || "Ready to take the next step in your healthcare career?"}
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          {t?.cta?.subtitle || "Join our community of healthcare professionals and institutions"}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="secondary">
            <Link to="/signup/professional">{joinUsText}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-transparent text-white hover:bg-white hover:text-medical-600">
            <Link to="/contact">{t?.common?.contact || "Contact Us"}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
