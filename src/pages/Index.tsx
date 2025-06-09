
import React, { Suspense } from 'react';
import MainLayout from '@/components/MainLayout';
import HeroSection from '@/components/landing/HeroSection';
import { featuredVacancies, featuredProfessionals } from '@/data/landingPageData';

// Lazy load only the heavy components that are below the fold
const WhySolviaSectionOptimized = React.lazy(() => import('@/components/landing/WhySolviaSectionOptimized'));
const TimelineSection = React.lazy(() => import('@/components/landing/TimelineSection'));
const ProfessionalsSection = React.lazy(() => import('@/components/landing/ProfessionalsSection'));
const VacanciesSection = React.lazy(() => import('@/components/landing/VacanciesSection'));
const InsightsSection = React.lazy(() => import('@/components/landing/InsightsSection'));
const BlogSection = React.lazy(() => import('@/components/landing/BlogSection'));
const LearningSection = React.lazy(() => import('@/components/landing/LearningSection'));
const CTASection = React.lazy(() => import('@/components/landing/CTASection'));

// Optimized loading fallback - smaller and faster
const LoadingFallback = ({ height }: { height: string }) => (
  <div className={`${height} bg-gray-50 flex items-center justify-center`}>
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Index = () => {
  return (
    <MainLayout>
      {/* Critical above-the-fold content - load immediately */}
      <HeroSection />
      
      {/* Below-the-fold sections with optimized lazy loading */}
      <Suspense fallback={<LoadingFallback height="h-48" />}>
        <WhySolviaSectionOptimized />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback height="h-64" />}>
        <TimelineSection />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback height="h-80" />}>
        <ProfessionalsSection professionals={featuredProfessionals} />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback height="h-80" />}>
        <VacanciesSection vacancies={featuredVacancies} />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback height="h-48" />}>
        <InsightsSection />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback height="h-64" />}>
        <BlogSection />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback height="h-80" />}>
        <LearningSection />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback height="h-48" />}>
        <CTASection />
      </Suspense>
    </MainLayout>
  );
};

export default Index;
