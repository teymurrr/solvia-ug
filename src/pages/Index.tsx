import React, { Suspense } from 'react';
import MainLayout from '@/components/MainLayout';
import HeroSectionWithSearch from '@/components/landing/HeroSectionWithSearch';
import PathToSuccessSection from '@/components/landing/PathToSuccessSection';
import PartnersSection from '@/components/landing/PartnersSection';
import EmployerBanner from '@/components/landing/EmployerBanner';
import BlackFridayBanner from '@/components/payments/BlackFridayBanner';
import { featuredVacancies } from '@/data/landingPageData';

// Lazy load only the heavy components that are below the fold
const VacanciesSectionRedesigned = React.lazy(() => import('@/components/landing/VacanciesSectionRedesigned'));
const TestimonialsSection = React.lazy(() => import('@/components/landing/TestimonialsSection'));
const BlogSection = React.lazy(() => import('@/components/landing/BlogSection'));
const LearningSectionCompact = React.lazy(() => import('@/components/landing/LearningSectionCompact'));
const CTASection = React.lazy(() => import('@/components/landing/CTASection'));

// Simple loading fallback
const LoadingFallback = ({ height }: { height: string }) => (
  <div className={`${height} bg-muted/30 animate-pulse flex items-center justify-center`}>
    <div className="text-muted-foreground">Loading...</div>
  </div>
);

const Index = () => {
  return (
    <MainLayout>
      {/* Black Friday Banner - promotional content */}
      <div className="container mx-auto px-4 pt-6">
        <BlackFridayBanner />
      </div>
      
      {/* Critical above-the-fold content - load immediately */}
      <HeroSectionWithSearch />
      
      {/* Partners/Accelerators Section */}
      <PartnersSection />
      
      {/* Path to Success section - 5 steps timeline */}
      <div id="path-to-success">
        <PathToSuccessSection />
      </div>
      
      {/* Open Positions section - redesigned */}
      <Suspense fallback={<LoadingFallback height="h-96" />}>
        <VacanciesSectionRedesigned vacancies={featuredVacancies} />
      </Suspense>
      
      {/* Employer Banner */}
      <EmployerBanner />
      
      {/* Testimonials section - replaces professionals */}
      <Suspense fallback={<LoadingFallback height="h-96" />}>
        <TestimonialsSection />
      </Suspense>
      
      {/* Learning section - compact version moved lower */}
      <Suspense fallback={<LoadingFallback height="h-48" />}>
        <LearningSectionCompact />
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
