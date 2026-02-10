import React from 'react';
import { FileCheck, Languages, Briefcase, UserCheck, Globe, HeadphonesIcon } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const WhatYouGetSection = () => {
  const { t } = useLanguage();
  
  const whatYouGet = t?.landing?.whatYouGet;

  const features = [
    {
      icon: FileCheck,
      title: whatYouGet?.features?.[0]?.title || "Document Preparation",
      description: whatYouGet?.features?.[0]?.description || "We review, organize, and prepare your complete file for submission — no risk of rejection."
    },
    {
      icon: Languages,
      title: whatYouGet?.features?.[1]?.title || "Translations & Apostilles",
      description: whatYouGet?.features?.[1]?.description || "Certified translations and apostille coordination handled for you."
    },
    {
      icon: Globe,
      title: whatYouGet?.features?.[2]?.title || "Homologation Management",
      description: whatYouGet?.features?.[2]?.description || "End-to-end management of your license recognition process in your target country."
    },
    {
      icon: Briefcase,
      title: whatYouGet?.features?.[3]?.title || "Job Matching",
      description: whatYouGet?.features?.[3]?.description || "Access to verified positions in hospitals and clinics across Europe."
    },
    {
      icon: UserCheck,
      title: whatYouGet?.features?.[4]?.title || "Personal Advisor",
      description: whatYouGet?.features?.[4]?.description || "A dedicated case manager guides you through every step of the process."
    },
    {
      icon: HeadphonesIcon,
      title: whatYouGet?.features?.[5]?.title || "Ongoing Support",
      description: whatYouGet?.features?.[5]?.description || "Continuous follow-up until you're working in your new country."
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {whatYouGet?.title || "What Solvia Handles for You"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {whatYouGet?.subtitle || "We take care of the complex paperwork so you can focus on your career"}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatYouGetSection;
