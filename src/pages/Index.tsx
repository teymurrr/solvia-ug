
import React from 'react';
import MainLayout from '@/components/MainLayout';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import HeroSection from '@/components/landing/HeroSection';
import VacanciesSection from '@/components/landing/VacanciesSection';
import ProfessionalsSection from '@/components/landing/ProfessionalsSection';
import WhySolviaSection from '@/components/landing/WhySolviaSection';
import InsightsSection from '@/components/landing/InsightsSection';
import CTASection from '@/components/landing/CTASection';
import { featuredVacancies, featuredProfessionals } from '@/data/landingPageData';

const Index = () => {
  return (
    <MainLayout>
      <div className="min-h-screen">
        <HowItWorksSection /> {/* Moved to the top */}
        <HeroSection />
        <VacanciesSection vacancies={featuredVacancies} />
        <div className="py-8 bg-gradient-to-tr from-blue-50/50 via-white to-blue-50/50">
          <ProfessionalsSection professionals={featuredProfessionals} />
        </div>
        <WhySolviaSection />
        <InsightsSection />
        <CTASection />
      </div>
    </MainLayout>
  );
};

export default Index;
