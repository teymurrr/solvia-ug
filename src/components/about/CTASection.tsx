
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

const CTASection = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-medical-700 py-16 px-4">
      <div className="container mx-auto text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.about?.cta?.title || 'Join Our Healthcare Community'}</h2>
        <p className="max-w-2xl mx-auto mb-8 text-lg opacity-90">{t.about?.cta?.subtitle || 'Connect with healthcare professionals and institutions worldwide.'}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="default" className="bg-white text-medical-700 hover:bg-gray-100">
            <Link to="/signup/professional">{t.about?.cta?.professionalCta || 'Join as Professional'}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-medical-600">
            <Link to="/signup/institution">{t.about?.cta?.institutionCta || 'Join as Institution'}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
