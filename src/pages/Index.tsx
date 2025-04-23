
import React from 'react';
import MainLayout from '@/components/MainLayout';
import HeroSection from '@/components/landing/HeroSection';
import StatsSection from '@/components/landing/StatsSection';
import VacanciesSection from '@/components/landing/VacanciesSection';
import ProfessionalsSection from '@/components/landing/ProfessionalsSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import LearningSection from '@/components/landing/LearningSection';
import BlogSection from '@/components/landing/BlogSection';
import CTASection from '@/components/landing/CTASection';
import { featuredProfessionals, featuredVacancies, featuredBlogs } from '@/data/landingPageData';

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <StatsSection />
      <VacanciesSection vacancies={featuredVacancies} /> {/* Moved to first position after StatsSection */}
      <ProfessionalsSection professionals={featuredProfessionals} />
      <HowItWorksSection />
      <LearningSection />
      <BlogSection posts={featuredBlogs} />
      <CTASection />
    </MainLayout>
  );
};

export default Index;
