
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/hooks/useLanguage';

// Static fallback content
const STATIC_CTA_CONTENT = {
  title: "Ready to Transform Healthcare Recruitment?",
  subtitle: "Join thousands of healthcare professionals and institutions already using Solvia.",
  createAccount: "Free Sign Up",
  talkToTeam: "Talk to Our Team"
};

const CTASection = () => {
  const { t } = useLanguage();
  
  // Use static content with proper fallbacks
  const ctaData = React.useMemo(() => {
    if (!t || !t.cta) {
      return STATIC_CTA_CONTENT;
    }
    
    return {
      title: t.cta.title || STATIC_CTA_CONTENT.title,
      subtitle: t.cta.subtitle || STATIC_CTA_CONTENT.subtitle,
      createAccount: t.cta.createAccount || STATIC_CTA_CONTENT.createAccount,
      talkToTeam: t.cta.talkToTeam || STATIC_CTA_CONTENT.talkToTeam
    };
  }, [t]);
  
  return (
    <section className="hero-gradient text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-[42px] font-bold mb-4">{ctaData.title}</h2>
          <p className="text-[20px] mb-8">{ctaData.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/signup">{ctaData.createAccount}</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" asChild>
              <Link to="/contact">{ctaData.talkToTeam}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
