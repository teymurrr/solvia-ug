
import React, { useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import HeroSection from '@/components/about/HeroSection';
import MissionSection from '@/components/about/MissionSection';
import StorySection from '@/components/about/StorySection';
import TeamSection from '@/components/about/TeamSection';
import ValuesSection from '@/components/about/ValuesSection';
import CTASection from '@/components/about/CTASection';
import { useLanguage } from '@/hooks/useLanguage';

// List of critical images to preload
const criticalImages = [
  "/lovable-uploads/431c73d2-5785-4d33-8f35-d11742c829e0.png",
  "/lovable-uploads/50866c4f-dae7-4f12-82b4-78f2002e281a.png",
  "/lovable-uploads/6076d717-f7de-4fe6-b318-20bfcd6e2aa6.png"
];

const About = () => {
  const { t } = useLanguage();

  // Preload critical images
  useEffect(() => {
    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <MainLayout>
      {/* Add preload links for critical images */}
      {criticalImages.map((src, index) => (
        <link key={index} rel="preload" href={src} as="image" />
      ))}
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
