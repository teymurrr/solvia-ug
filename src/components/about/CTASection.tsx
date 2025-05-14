
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/hooks/useLanguage';

const CTASection = () => {
  const { t } = useLanguage();
  
  // Using safe fallbacks for translations that might not exist
  const title = t?.about?.missionText || "Connect with our team";
  const subtitle = t?.about?.visionText || "Learn more about how Solvia can help your institution";
  const joinUsText = t?.about?.mission?.title || "Join Us"; // Changed to use existing translation
  const contactTeamText = t?.common?.contact || "Contact Team"; // Changed to use existing translation
  
  return (
    <section className="py-16 bg-gradient-to-r from-primary via-primary/95 to-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4 text-white">{title}</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild>
            <Link to="/signup">{joinUsText}</Link>
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-white hover:bg-white/10 text-white" asChild>
            <Link to="/contact">{contactTeamText}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
