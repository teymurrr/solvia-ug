
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, GraduationCap, Check } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const LearningSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="space-y-3 mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 leading-tight">
            {t?.learning?.title || "Solvia Learning"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t?.learning?.subtitle || "Specialized courses to accelerate your medical career in Europe"}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
          {/* German Language Courses */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Medical German Courses</h3>
            <p className="text-gray-600 mb-4">A1 to C1 levels with medical vocabulary from day one. TELC B2-C1 exam preparation included.</p>
          </div>

          {/* FSP Courses */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">FSP Exam Preparation</h3>
            <p className="text-gray-600 mb-4">Complete preparation for the medical license exam with mock tests and personal mentoring.</p>
          </div>
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
