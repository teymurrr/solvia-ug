
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

const TeamSection = () => {
  const { t } = useLanguage();
  
  // Default values in case translations are not available
  const title = t?.about?.team?.title || "Our Team";
  const description = t?.about?.team?.description || "We are a dedicated team of healthcare and technology experts committed to transforming medical recruitment.";

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">{title}</h2>
          <p className="text-lg text-muted-foreground text-center mb-12">
            {description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Placeholder for team members */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
