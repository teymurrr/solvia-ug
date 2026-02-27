import React from 'react';
import MainLayout from '@/components/MainLayout';
import HeroSection from '@/components/employer-landing/HeroSection';
import TimelineSection from '@/components/employer-landing/TimelineSection';
import WhySolviaSection from '@/components/employer-landing/WhySolviaSection';
import CTASection from '@/components/employer-landing/CTASection';
import SEO from '@/components/SEO';
import { useLanguage } from '@/hooks/useLanguage';

const EmployersLanding = () => {
  const { t } = useLanguage();
  const seoData = (t as any)?.seo?.employers;

  return (
    <MainLayout>
      <SEO
        title={seoData?.title || 'Hire International Medical Professionals | Solvia for Employers'}
        description={seoData?.description || 'Recruit qualified international doctors and nurses for your hospital or clinic.'}
        path="/employers"
      />
      <div className="min-h-screen relative">
        {/* Shimmering gradient background with increased contrast */}
        <div className="fixed inset-0 bg-gradient-to-br from-blue-100 via-white to-blue-100 animate-gradient-slow -z-10" />
        
        {/* Keep all sections with transparent backgrounds */}
        <HeroSection />
        <TimelineSection />
        <WhySolviaSection />
        <CTASection />
      </div>
    </MainLayout>
  );
};

export default EmployersLanding;
