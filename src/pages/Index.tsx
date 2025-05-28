
import MainLayout from '@/components/MainLayout';
import HeroSection from '@/components/landing/HeroSection';
import WhySolviaSection from '@/components/landing/WhySolviaSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import ProfessionalsSection from '@/components/landing/ProfessionalsSection';
import VacanciesSection from '@/components/landing/VacanciesSection';
import InsightsSection from '@/components/landing/InsightsSection';
import BlogSection from '@/components/landing/BlogSection';
import LearningSection from '@/components/landing/LearningSection';
import CTASection from '@/components/landing/CTASection';
import { featuredVacancies, featuredProfessionals, featuredBlogs } from '@/data/landingPageData';

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      <WhySolviaSection />
      <HowItWorksSection />
      <ProfessionalsSection professionals={featuredProfessionals} />
      <VacanciesSection vacancies={featuredVacancies} />
      <InsightsSection />
      <BlogSection posts={featuredBlogs} />
      <LearningSection />
      <CTASection />
    </MainLayout>
  );
};

export default Index;
