
import React from 'react';
import MainLayout from '@/components/MainLayout';
import HeroSection from '@/components/for-doctors/HeroSection';
import OpenPositionsSection from '@/components/for-doctors/OpenPositionsSection';
import USPSection from '@/components/for-doctors/USPSection';
import SuccessStoriesSection from '@/components/for-doctors/SuccessStoriesSection';
import LearningSection from '@/components/landing/LearningSection';
import FAQSection from '@/components/for-doctors/FAQSection';
import BlogSection from '@/components/landing/BlogSection';

const ForDoctors = () => {
  return (
    <MainLayout>
      <HeroSection />
      <OpenPositionsSection />
      <USPSection />
      <SuccessStoriesSection />
      <LearningSection />
      <BlogSection />
      <FAQSection />
    </MainLayout>
  );
};

export default ForDoctors;
