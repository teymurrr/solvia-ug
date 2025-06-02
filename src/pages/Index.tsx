
import React, { Suspense } from 'react';
import MainLayout from '@/components/MainLayout';
import HeroSection from '@/components/landing/HeroSection';
import LazySection from '@/components/ui/lazy-section';
import { featuredVacancies, featuredProfessionals } from '@/data/landingPageData';

// Lazy load heavy components
const WhySolviaSection = React.lazy(() => import('@/components/landing/WhySolviaSection'));
const TimelineSection = React.lazy(() => import('@/components/landing/TimelineSection'));
const ProfessionalsSection = React.lazy(() => import('@/components/landing/ProfessionalsSection'));
const VacanciesSection = React.lazy(() => import('@/components/landing/VacanciesSection'));
const InsightsSection = React.lazy(() => import('@/components/landing/InsightsSection'));
const BlogSection = React.lazy(() => import('@/components/landing/BlogSection'));
const LearningSection = React.lazy(() => import('@/components/landing/LearningSection'));
const CTASection = React.lazy(() => import('@/components/landing/CTASection'));

const Index = () => {
  return (
    <MainLayout>
      {/* Critical above-the-fold content - load immediately */}
      <HeroSection />
      
      {/* Below-the-fold sections - lazy load */}
      <LazySection fallback={<div className="h-64 bg-gray-50 animate-pulse" />}>
        <WhySolviaSection />
      </LazySection>
      
      <LazySection fallback={<div className="h-80 bg-white animate-pulse" />}>
        <TimelineSection />
      </LazySection>
      
      <LazySection fallback={<div className="h-96 bg-white animate-pulse" />}>
        <ProfessionalsSection professionals={featuredProfessionals} />
      </LazySection>
      
      <LazySection fallback={<div className="h-96 bg-white animate-pulse" />}>
        <VacanciesSection vacancies={featuredVacancies} />
      </LazySection>
      
      <LazySection fallback={<div className="h-64 bg-gray-50 animate-pulse" />}>
        <InsightsSection />
      </LazySection>
      
      <LazySection fallback={<div className="h-80 bg-white animate-pulse" />}>
        <BlogSection />
      </LazySection>
      
      <LazySection fallback={<div className="h-96 bg-blue-50 animate-pulse" />}>
        <LearningSection />
      </LazySection>
      
      <LazySection fallback={<div className="h-64 bg-gradient-to-r from-blue-600 to-blue-700 animate-pulse" />}>
        <CTASection />
      </LazySection>
    </MainLayout>
  );
};

export default Index;
