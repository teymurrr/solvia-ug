
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

const CTASection = () => {
  const { t } = useLanguage();

  // Get CTA texts directly from any available source (t.about?.cta or t.cta)
  // with appropriate fallbacks
  const title = t?.about?.cta?.title || t?.cta?.title || 'Join Our Healthcare Community';
  const subtitle = t?.about?.cta?.subtitle || t?.cta?.subtitle || 'Connect with healthcare professionals and institutions worldwide.';
  const createAccount = t?.about?.cta?.createAccount || t?.cta?.createAccount || 'Create Your Account';
  const talkToTeam = t?.about?.cta?.talkToTeam || t?.cta?.talkToTeam || 'Talk to Our Team';

  return (
    <section className="bg-medical-700 py-16 px-4">
      <div className="container mx-auto text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
        <p className="max-w-2xl mx-auto mb-8 text-lg opacity-90">{subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="default" className="bg-white text-medical-700 hover:bg-gray-100">
            <Link to="/signup/professional">{createAccount}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-medical-600">
            <Link to="/signup/institution">{talkToTeam}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
