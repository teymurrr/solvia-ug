
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
      <div className="min-h-screen bg-gray-900">
        <HeroSection />
        <div className="py-8 bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900">
          <ProfessionalsSection professionals={featuredProfessionals} />
        </div>
        <HowItWorksSection />
        <WhySolviaSection />
        <InsightsSection />
        <CTASection />
      </div>
    </MainLayout>
  );
};

export default EmployersLanding;
