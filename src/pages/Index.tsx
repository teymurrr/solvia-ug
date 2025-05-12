
import React from 'react';
import MainLayout from '@/components/MainLayout';
import HeroSection from '@/components/landing/HeroSection';
import TimelineSection from '@/components/landing/TimelineSection';
import VacanciesSection from '@/components/landing/VacanciesSection';
import WhySolviaSection from '@/components/landing/WhySolviaSection';
import LearningSection from '@/components/landing/LearningSection';
import CTASection from '@/components/landing/CTASection';
import ProfessionalsSection from '@/components/landing/ProfessionalsSection';
import { featuredVacancies, featuredProfessionals } from '@/data/landingPageData';

const Index = () => {
  return (
    <MainLayout>
      <div className="min-h-screen">
        <HeroSection />
        <WhySolviaSection />
        <VacanciesSection vacancies={featuredVacancies} />
        <ProfessionalsSection professionals={featuredProfessionals} />
        <TimelineSection />
        <LearningSection />
        <CTASection />
      </div>
    </MainLayout>
  );
};

export default Index;
