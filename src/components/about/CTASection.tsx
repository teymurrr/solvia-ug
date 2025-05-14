
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

const CTASection = () => {
  const { t } = useLanguage();
  
  const joinUs = t?.about?.joinUs || "Join Us";
  const createAccount = t?.auth?.createAccount || "Create Your Account";
  const contactTeam = t?.common?.contactTeam || "Contact Our Team";

  return (
    <section className="hero-gradient text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">{joinUs}</h2>
          <p className="text-lg mb-8">
            {t?.about?.ctaDescription || "Whether you're a healthcare professional seeking new opportunities or an institution looking for talent, we're here to help."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/signup">{createAccount}</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" asChild>
              <Link to="/contact">{contactTeam}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
