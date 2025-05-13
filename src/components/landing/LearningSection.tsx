
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, GraduationCap, BookOpen } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const LearningSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="space-y-3 mb-8 text-center">
          <h2 className="text-[42px] font-bold text-gray-900 leading-tight">
            {t?.learning?.title || "Solvia Learning"}
          </h2>
          <p className="text-[20px] text-gray-600">
            {t?.learning?.subtitle || "Expand your knowledge and skills with our specialized healthcare courses"}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* German Language Courses */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t?.learning?.germanCourses?.title || "German Language Courses"}</h3>
            <p className="text-gray-600 mb-4">{t?.learning?.germanCourses?.subtitle || "Master medical German with our specialized language courses designed specifically for healthcare professionals."}</p>
            <ul className="space-y-2 mb-4">
              {(t?.learning?.germanCourses?.features || [
                "Basic to Advanced Medical German",
                "Flexible Learning Schedule",
                "Telc Medical Preparation"
              ]).map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* FSP Courses */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t?.learning?.fspCourses?.title || "FSP Preparation Courses"}</h3>
            <p className="text-gray-600 mb-4">{t?.learning?.fspCourses?.subtitle || "Comprehensive preparation for your medical license examination in Germany."}</p>
            <ul className="space-y-2 mb-4">
              {(t?.learning?.fspCourses?.features || [
                "Complete FSP Study Materials",
                "Practice Examinations",
                "One-on-One Mentoring"
              ]).map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="flex justify-center mt-8">
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
