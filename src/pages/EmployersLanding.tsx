import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import MainLayout from '@/components/MainLayout';
import VacanciesSection from '@/components/landing/VacanciesSection';
import LearningSection from '@/components/landing/LearningSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import BlogSection from '@/components/landing/BlogSection';
import { featuredVacancies, featuredBlogs } from '@/data/landingPageData';
import { Card, CardContent } from "@/components/ui/card";
import { Globe, FileCheck, Clock, Users, Building2, Calendar } from 'lucide-react';
import ProfessionalsSection from '@/components/landing/ProfessionalsSection';
import { featuredProfessionals } from '@/data/landingPageData';

const EmployersLanding = () => {
  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Find, Connect & Hire Global Healthcare Professionals
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Solvia is your go-to platform for discovering international doctors and nurses prepared for relocation
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/professionals">Browse Talents</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/contact">Book a Call</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Vacancies Section - First */}
        <VacanciesSection vacancies={featuredVacancies} />

        {/* Solvia Learning Section - Second */}
        <LearningSection />

        {/* How It Works Section - Third */}
        <HowItWorksSection />

        {/* Blog Section - Last */}
        <BlogSection posts={featuredBlogs} />
      </div>
    </MainLayout>
  );
};

export default EmployersLanding;
