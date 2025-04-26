
import React from 'react';
import MainLayout from '@/components/MainLayout';
import HeroSection from '@/components/landing/HeroSection';
import TimelineSection from '@/components/landing/TimelineSection';
import VacanciesSection from '@/components/landing/VacanciesSection';
import ProfessionalsSection from '@/components/landing/ProfessionalsSection';
import WhySolviaSection from '@/components/landing/WhySolviaSection';
import LearningSection from '@/components/landing/LearningSection';
import CTASection from '@/components/landing/CTASection';
import { featuredVacancies, featuredProfessionals } from '@/data/landingPageData';

const Index = () => {
  return (
    <MainLayout>
      <div className="min-h-screen">
        <HeroSection />
        <VacanciesSection vacancies={featuredVacancies} />
        <TimelineSection />
        <div className="py-8 bg-gradient-to-tr from-blue-50/50 via-white to-blue-50/50">
          <ProfessionalsSection professionals={featuredProfessionals} />
        </div>
        <WhySolviaSection />
        <LearningSection />
        <CTASection />
      </div>
    </MainLayout>
  );
};

export default Index;
