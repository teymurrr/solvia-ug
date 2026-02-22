import React, { Suspense } from 'react';
import MainLayout from '@/components/MainLayout';
import HeroSectionWithSearch from '@/components/landing/HeroSectionWithSearch';
import PathToSuccessSection from '@/components/landing/PathToSuccessSection';

// Lazy load sections below the fold
const JobExplorerSection = React.lazy(() => import('@/components/landing/JobExplorerSection'));
const SuccessStoriesSection = React.lazy(() => import('@/components/landing/SuccessStoriesSection'));
const ConversionFAQSection = React.lazy(() => import('@/components/landing/ConversionFAQSection'));
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
      {/* 1. PROMISE — Hero + Stats */}
      <HeroSectionWithSearch />
      
      {/* 2. HOW — Path to Success (4 steps, horizontal) */}
      <div id="path-to-success">
        <PathToSuccessSection />
      </div>


      {/* 4. PROOF — Real jobs waiting */}
      <Suspense fallback={<LoadingFallback height="h-96" />}>
        <JobExplorerSection />
      </Suspense>
      
      {/* 5. TRUST — Success stories */}
      <Suspense fallback={<LoadingFallback height="h-96" />}>
        <SuccessStoriesSection />
      </Suspense>
      
      {/* 6. OBJECTIONS — FAQ */}
      <Suspense fallback={<LoadingFallback height="h-96" />}>
        <ConversionFAQSection />
      </Suspense>
      
      {/* 7. ACTION — Final CTA */}
      <Suspense fallback={<LoadingFallback height="h-64" />}>
        <SuperCTASection />
      </Suspense>
    </MainLayout>
  );
};

export default Index;
