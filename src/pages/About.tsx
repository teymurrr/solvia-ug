
import React from 'react';
import MainLayout from '@/components/MainLayout';
import HeroSection from '@/components/about/HeroSection';
import MissionSection from '@/components/about/MissionSection';
import StorySection from '@/components/about/StorySection';
import TeamSection from '@/components/about/TeamSection';
import ValuesSection from '@/components/about/ValuesSection';
import CTASection from '@/components/about/CTASection';

const About = () => {
  return (
    <MainLayout>
      <HeroSection />
      <MissionSection />
      <StorySection />
      <TeamSection />
      <ValuesSection />
      <CTASection />
    </MainLayout>
  );
};

export default About;
