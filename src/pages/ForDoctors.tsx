
import React from 'react';
import MainLayout from '@/components/MainLayout';
import HeroSection from '@/components/for-doctors/HeroSection';
import USPSection from '@/components/for-doctors/USPSection';
import SuccessStoriesSection from '@/components/for-doctors/SuccessStoriesSection';

const ForDoctors = () => {
  return (
    <MainLayout>
      <HeroSection />
      <USPSection />
      <SuccessStoriesSection />
    </MainLayout>
  );
};

export default ForDoctors;
