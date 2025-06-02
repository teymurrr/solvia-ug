
import React, { Suspense } from 'react';
import MainLayout from '@/components/MainLayout';
import HeroSection from '@/components/landing/HeroSection';
import LazySection from '@/components/ui/lazy-section';
import { featuredVacancies, featuredProfessionals } from '@/data/landingPageData';

// Lazy load heavy components with optimized chunks
const WhySolviaSectionOptimized = React.lazy(() => import('@/components/landing/WhySolviaSectionOptimized'));
const TimelineSection = React.lazy(() => import('@/components/landing/TimelineSection'));
const ProfessionalsSection = React.lazy(() => import('@/components/landing/ProfessionalsSection'));
const VacanciesSection = React.lazy(() => import('@/components/landing/VacanciesSection'));
const InsightsSection = React.lazy(() => import('@/components/landing/InsightsSection'));
const BlogSection = React.lazy(() => import('@/components/landing/BlogSection'));
const LearningSection = React.lazy(() => import('@/components/landing/LearningSection'));
const CTASection = React.lazy(() => import('@/components/landing/CTASection'));

// Optimized loading skeletons
const OptimizedSkeleton = React.memo(({ height, bgColor }: { height: string; bgColor: string }) => (
  <div className={`${height} ${bgColor} animate-pulse`} />
));

OptimizedSkeleton.displayName = 'OptimizedSkeleton';

const Index = () => {
  return (
    <MainLayout>
      {/* Critical above-the-fold content - load immediately */}
      <HeroSection />
      
      {/* Below-the-fold sections - lazy load with optimized fallbacks */}
      <LazySection 
        fallback={<OptimizedSkeleton height="h-64" bgColor="bg-gray-50" />}
        rootMargin="50px"
      >
        <WhySolviaSectionOptimized />
      </LazySection>
      
      <LazySection 
        fallback={<OptimizedSkeleton height="h-80" bgColor="bg-white" />}
        rootMargin="100px"
      >
        <TimelineSection />
      </LazySection>
      
      <LazySection 
        fallback={<OptimizedSkeleton height="h-96" bgColor="bg-white" />}
        rootMargin="150px"
      >
        <ProfessionalsSection professionals={featuredProfessionals} />
      </LazySection>
      
      <LazySection 
        fallback={<OptimizedSkeleton height="h-96" bgColor="bg-white" />}
        rootMargin="150px"
      >
        <VacanciesSection vacancies={featuredVacancies} />
      </LazySection>
      
      <LazySection 
        fallback={<OptimizedSkeleton height="h-64" bgColor="bg-gray-50" />}
        rootMargin="200px"
      >
        <InsightsSection />
      </LazySection>
      
      <LazySection 
        fallback={<OptimizedSkeleton height="h-80" bgColor="bg-white" />}
        rootMargin="200px"
      >
        <BlogSection />
      </LazySection>
      
      <LazySection 
        fallback={<OptimizedSkeleton height="h-96" bgColor="bg-blue-50" />}
        rootMargin="200px"
      >
        <LearningSection />
      </LazySection>
      
      <LazySection 
        fallback={<OptimizedSkeleton height="h-64" bgColor="bg-gradient-to-r from-blue-600 to-blue-700" />}
        rootMargin="200px"
      >
        <CTASection />
      </LazySection>
    </MainLayout>
  );
};

export default Index;
