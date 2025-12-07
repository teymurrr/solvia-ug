import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import eworksLogo from '@/assets/partners/eworks-logo.png';
import clabLogo from '@/assets/partners/clab-logo.jpeg';

const PartnersSection = () => {
  const { t } = useLanguage();

  const partners = [
    {
      name: 'eWorks',
      logo: eworksLogo,
      alt: 'eWorks Accelerator',
    },
    {
      name: 'C-Lab',
      logo: clabLogo,
      alt: 'C-Lab Accelerator',
    },
  ];

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
            {t?.partners?.title || "Backed by leading accelerators"}
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {partners.map((partner, index) => (
            <div 
              key={index}
              className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
            >
              <img
                src={partner.logo}
                alt={partner.alt}
                className="h-12 md:h-16 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
