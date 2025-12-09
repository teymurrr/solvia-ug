import React, { Suspense } from 'react';
import MainLayout from '@/components/MainLayout';
import HeroSectionWithSearch from '@/components/landing/HeroSectionWithSearch';
import PathToSuccessSection from '@/components/landing/PathToSuccessSection';
import PartnersSection from '@/components/landing/PartnersSection';
import EmployerBanner from '@/components/landing/EmployerBanner';
import BlackFridayBanner from '@/components/payments/BlackFridayBanner';

// Lazy load sections below the fold
const JobExplorerSection = React.lazy(() => import('@/components/landing/JobExplorerSection'));
const SuccessStoriesSection = React.lazy(() => import('@/components/landing/SuccessStoriesSection'));
const ConversionFAQSection = React.lazy(() => import('@/components/landing/ConversionFAQSection'));
const LearningMiniBanner = React.lazy(() => import('@/components/landing/LearningMiniBanner'));
const SuperCTASection = React.lazy(() => import('@/components/landing/SuperCTASection'));

// Simple loading fallback
const LoadingFallback = ({ height }: { height: string }) => (
  <div className={`${height} bg-muted/30 animate-pulse flex items-center justify-center`}>
    <div className="text-muted-foreground">Loading...</div>
  </div>
);

const Index = () => {
  return (
    <MainLayout>
      {/* Critical above-the-fold content - load immediately */}
      <HeroSectionWithSearch />
      
      {/* Black Friday Banner - promotional content */}
      <div className="container mx-auto px-4 py-6">
        <BlackFridayBanner />
      </div>
      
      {/* Partners/Accelerators Section */}
      <PartnersSection />
      
      {/* Path to Success section - 5 steps timeline */}
      <div id="path-to-success">
        <PathToSuccessSection />
      </div>
      
      {/* Job Explorer - includes country comparison with pricing */}
      <Suspense fallback={<LoadingFallback height="h-96" />}>
        <JobExplorerSection />
      </Suspense>
      
      {/* Employer Banner */}
      <EmployerBanner />
      
      {/* Success Stories - 3 static cards focused on homologation */}
      <Suspense fallback={<LoadingFallback height="h-96" />}>
        <SuccessStoriesSection />
      </Suspense>
      
      {/* Conversion FAQ with micro-CTAs */}
      <Suspense fallback={<LoadingFallback height="h-96" />}>
        <ConversionFAQSection />
      </Suspense>
      
      {/* Learning Mini Banner - minimal, non-intrusive */}
      <Suspense fallback={<LoadingFallback height="h-16" />}>
        <LearningMiniBanner />
      </Suspense>
      
      {/* Super CTA - Final conversion section */}
      <Suspense fallback={<LoadingFallback height="h-64" />}>
        <SuperCTASection />
      </Suspense>
    </MainLayout>
  );
};

export default Index;
