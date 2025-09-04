
import React, { Suspense } from 'react';
import MainLayout from '@/components/MainLayout';
import HeroSectionWithSearch from '@/components/landing/HeroSectionWithSearch';
import PathToSuccessSection from '@/components/landing/PathToSuccessSection';
import { featuredVacancies } from '@/data/landingPageData';

// Lazy load only the heavy components that are below the fold
const VacanciesSectionRedesigned = React.lazy(() => import('@/components/landing/VacanciesSectionRedesigned'));
const TestimonialsSection = React.lazy(() => import('@/components/landing/TestimonialsSection'));
const BlogSection = React.lazy(() => import('@/components/landing/BlogSection'));
const LearningSectionRedesigned = React.lazy(() => import('@/components/landing/LearningSectionRedesigned'));
const CTASection = React.lazy(() => import('@/components/landing/CTASection'));

// Simple loading fallback
const LoadingFallback = ({ height }: { height: string }) => (
  <div className={`${height} bg-gray-100 animate-pulse flex items-center justify-center`}>
    <div className="text-gray-500">Loading...</div>
  </div>
);

const Index = () => {
  return (
    <MainLayout>
      {/* Critical above-the-fold content - load immediately */}
      <HeroSectionWithSearch />
      
      {/* Path to Success section - 5 steps timeline */}
      <div id="path-to-success">
        <PathToSuccessSection />
      </div>
      
      {/* Open Positions section - redesigned */}
      <Suspense fallback={<LoadingFallback height="h-96" />}>
        <VacanciesSectionRedesigned vacancies={featuredVacancies} />
      </Suspense>
      
      {/* Testimonials section - replaces professionals */}
      <Suspense fallback={<LoadingFallback height="h-96" />}>
        <TestimonialsSection />
      </Suspense>
      
      {/* Learning section - redesigned and moved before blog */}
      <Suspense fallback={<LoadingFallback height="h-96" />}>
        <LearningSectionRedesigned />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback height="h-80" />}>
        <BlogSection />
      </Suspense>
      
      <Suspense fallback={<LoadingFallback height="h-64" />}>
        <CTASection />
      </Suspense>
    </MainLayout>
  );
};

export default Index;
