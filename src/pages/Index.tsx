
import MainLayout from '@/components/MainLayout';
import HeroSection from '@/components/landing/HeroSection';
import WhySolviaSection from '@/components/landing/WhySolviaSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import ProfessionalsSection from '@/components/landing/ProfessionalsSection';
import VacanciesSection from '@/components/landing/VacanciesSection';
import StatsSection from '@/components/landing/StatsSection';
import InsightsSection from '@/components/landing/InsightsSection';
import BlogSection from '@/components/landing/BlogSection';
import LearningSection from '@/components/landing/LearningSection';
import CTASection from '@/components/landing/CTASection';
import AdminGranter from '@/components/AdminGranter';

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <AdminGranter />
      <WhySolviaSection />
      <HowItWorksSection />
      <ProfessionalsSection />
      <VacanciesSection />
      <StatsSection />
      <InsightsSection />
      <BlogSection />
      <LearningSection />
      <CTASection />
    </MainLayout>
  );
};

export default Index;
