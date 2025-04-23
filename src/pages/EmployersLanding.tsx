
import React from 'react';
import MainLayout from '@/components/MainLayout';
import HeroSection from '@/components/employer-landing/HeroSection';
import HowItWorksSection from '@/components/employer-landing/HowItWorksSection';
import ProfessionalsSection from '@/components/landing/ProfessionalsSection';
import WhySolviaSection from '@/components/employer-landing/WhySolviaSection';
import InsightsSection from '@/components/employer-landing/InsightsSection';
import CTASection from '@/components/employer-landing/CTASection';
import { featuredProfessionals } from '@/data/landingPageData';

const EmployersLanding = () => {
  return (
    <MainLayout>
      <div className="min-h-screen">
        <HeroSection />
        <HowItWorksSection />
        <section className="py-16 bg-gradient-to-tr from-blue-50/50 via-white to-blue-50/50">
          <ProfessionalsSection professionals={featuredProfessionals} />
        </section>
        <WhySolviaSection />
        <InsightsSection />
        <CTASection />
      </div>
    </MainLayout>
  );
};

export default EmployersLanding;
