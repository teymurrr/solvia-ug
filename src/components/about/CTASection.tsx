
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/hooks/useLanguage';

const CTASection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-16 bg-gradient-to-r from-primary via-primary/95 to-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{t?.cta?.title || "Ready to Transform Healthcare Recruitment?"}</h2>
        <p className="text-xl mb-8">{t?.cta?.subtitle || "Join thousands of healthcare professionals and institutions already using Solvia."}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild>
            <Link to="/signup">{t?.cta?.createAccount || "Create Your Account"}</Link>
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-white hover:bg-white/10 text-white" asChild>
            <Link to="/contact">{t?.cta?.talkToTeam || "Talk to Our Team"}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
