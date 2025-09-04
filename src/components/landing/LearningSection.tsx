
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, GraduationCap, Check } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const LearningSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-8 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t?.learning?.title || "Solvia Learning"}
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Medical German A1-C1 • FSP Exam Prep • TELC Certification
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button variant="outline" asChild className="group border-primary text-primary hover:bg-primary/10">
            <Link to="/learning" className="flex items-center">
              {t?.learning?.exploreCourses || "Explore Courses"}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LearningSection;
