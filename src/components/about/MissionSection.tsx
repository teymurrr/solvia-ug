
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

const MissionSection = () => {
  const { t } = useLanguage();
  
  // Default values in case translations are not available
  const title = t?.about?.mission?.title || "Our Mission";
  const description = t?.about?.mission?.description || "Connecting qualified healthcare professionals with institutions worldwide, providing opportunities for career growth and ensuring quality healthcare delivery.";

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">{title}</h2>
          <p className="text-lg text-muted-foreground text-center">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
