
import React, { Suspense } from 'react';
import MainLayout from '@/components/MainLayout';
import HeroSection from '@/components/landing/HeroSection';
import { featuredVacancies, featuredProfessionals } from '@/data/landingPageData';

// Lazy load only the heavy components that are below the fold
const PathToSuccessSection = React.lazy(() => import('@/components/landing/PathToSuccessSection'));
const TimelineSection = React.lazy(() => import('@/components/landing/TimelineSection'));
const ProfessionalsSection = React.lazy(() => import('@/components/landing/ProfessionalsSection'));
const VacanciesSection = React.lazy(() => import('@/components/landing/VacanciesSection'));
const InsightsSection = React.lazy(() => import('@/components/landing/InsightsSection'));
const BlogSection = React.lazy(() => import('@/components/landing/BlogSection'));
const LearningSection = React.lazy(() => import('@/components/landing/LearningSection'));
const CTASection = React.lazy(() => import('@/components/landing/CTASection'));

// Simple loading fallback
const LoadingFallback = ({ height }: { height: string }) => (
  <div className={`${height} bg-gray-100 animate-pulse flex items-center justify-center`}>
    <div className="text-gray-500">Loading...</div>
  </div>
);

const ForDoctors = () => {
  return (
    <MainLayout>
      {/* Critical above-the-fold content - load immediately */}
      <HeroSection />
      
      {/* Why Solvia section moved right after hero */}
      <Suspense fallback={<LoadingFallback height="h-64" />}>
        <PathToSuccessSection />
      </Suspense>
      
      {/* Open Positions section */}
      <Suspense fallback={<LoadingFallback height="h-96" />}>
        <VacanciesSection vacancies={featuredVacancies} />
      </Suspense>
      
      {/* Below-the-fold sections with simplified lazy loading */}
      <Suspense fallback={<LoadingFallback height="h-80" />}>
        <TimelineSection />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback height="h-96" />}>
        <ProfessionalsSection professionals={featuredProfessionals} />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback height="h-64" />}>
        <InsightsSection />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback height="h-80" />}>
        <BlogSection />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback height="h-96" />}>
        <LearningSection />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback height="h-64" />}>
        <CTASection />
      </Suspense>
    </MainLayout>
  );
};

export default ForDoctors;
