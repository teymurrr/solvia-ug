import React from 'react';
import MainLayout from '@/components/MainLayout';
import HeroSection from '@/components/employer-landing/HeroSection';
import TimelineSection from '@/components/employer-landing/TimelineSection';
import ProfessionalsSection from '@/components/landing/ProfessionalsSection';
import WhySolviaSection from '@/components/employer-landing/WhySolviaSection';
import InsightsSection from '@/components/employer-landing/InsightsSection';
import CTASection from '@/components/employer-landing/CTASection';
import { featuredProfessionals } from '@/data/landingPageData';

const EmployersLanding = () => {
  return (
    <MainLayout>
      <div className="min-h-screen relative">
        {/* Shimmering gradient background with increased contrast */}
        <div className="fixed inset-0 bg-gradient-to-br from-blue-100 via-white to-blue-100 animate-gradient-slow -z-10" />
        
        {/* Keep all sections with transparent backgrounds */}
        <HeroSection />
        <div className="py-8 bg-transparent">
          <ProfessionalsSection professionals={featuredProfessionals} />
        </div>
        <TimelineSection />
        <WhySolviaSection />
        <InsightsSection />
        <CTASection />
      </div>
    </MainLayout>
  );
};

export default EmployersLanding;
