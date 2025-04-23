
import React from 'react';
import MainLayout from '@/components/MainLayout';
import HeroSection from '@/components/landing/HeroSection';
import VacanciesSection from '@/components/landing/VacanciesSection';
import LearningSection from '@/components/landing/LearningSection';
import ProfessionalsSection from '@/components/landing/ProfessionalsSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import BlogSection from '@/components/landing/BlogSection';
import CTASection from '@/components/landing/CTASection';
import { featuredProfessionals, featuredVacancies, featuredBlogs } from '@/data/landingPageData';

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <HowItWorksSection />
      <VacanciesSection vacancies={featuredVacancies} />
      <LearningSection />
      <ProfessionalsSection professionals={featuredProfessionals} />
      <BlogSection posts={featuredBlogs} />
      <CTASection />
    </MainLayout>
  );
};

export default Index;
