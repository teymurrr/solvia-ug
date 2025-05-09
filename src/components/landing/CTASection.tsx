
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/hooks/useLanguage';

const CTASection = () => {
  const { t } = useLanguage();
  
  // Default values in case translations aren't loaded yet
  const title = t?.cta?.title || "Ready to Transform Healthcare Recruitment?";
  const subtitle = t?.cta?.subtitle || "Join thousands of healthcare professionals and institutions already using Solvia.";
  const createAccount = t?.cta?.createAccount || "Create Your Account";
  const talkToTeam = t?.cta?.talkToTeam || "Talk to Our Team";
  
  return (
    <section className="hero-gradient text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg mb-8">{subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/signup">{createAccount}</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" asChild>
              <Link to="/contact">{talkToTeam}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
