
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, GraduationCap, Check } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const LearningSection = () => {
  const { t } = useLanguage();

  const renderFeatureList = (features: string[]) => {
    return features.map((feature, index) => {
      // Handle both formats: with and without descriptions
      let title = feature;
      let description = '';
      
      // Check if the feature has a title-description format using " - " as separator
      if (feature.includes(' - ')) {
        const parts = feature.split(' - ');
        title = parts[0];
        description = parts[1];
      }
      
      return (
        <li key={index} className="flex items-start space-x-3 mb-6">
          <div className="flex-shrink-0 mt-1">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="w-3 h-3 text-primary" />
            </div>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900 text-sm mb-2">{title}</div>
            {description && (
              <div className="text-gray-600 text-sm leading-relaxed">{description}</div>
            )}
          </div>
        </li>
      );
    });
  };

  // Default feature lists if translations are not available
  const germanCourseFeatures = t?.learning?.germanCourses?.features || [
    "General + Medical German Levels A1 to C1 - Structured curriculum from beginner to advanced with medical vocabulary included from the early stages.",
    "Flexible Learning Options - Choose between live online classes, self-paced modules, or hybrid formats—designed for professionals with busy schedules.",
    "TELC B2-C1 Medizin Preparation - Get targeted practice for the most recognized medical language exam, accepted across Germany.",
    "Interactive Practice Tools - Vocabulary flashcards, pronunciation drills, and doctor-patient conversation simulations.",
    "Progress Tracking - Follow your learning milestones and get reminders for practice sessions, assignments, and exams."
  ];

  const fspCourseFeatures = t?.learning?.fspCourses?.features || [
    "Complete FSP Curriculum - Structured lessons that mirror the real exam format: anamnesis, findings discussion, and doctor-to-doctor communication.",
    "Practice Examinations - Multiple full-length mock FSP exams with feedback from certified trainers.",
    "One-on-One Mentoring - Access personal feedback from medical professionals who've passed the FSP themselves.",
    "Real-life Case Scenarios - Train with realistic clinical cases to build both vocabulary and confidence.",
    "Exam Simulation App (Coming soon) - Practice anytime with our digital tool that simulates the FSP environment."
  ];

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
            <p className="text-gray-600 mb-4">{t?.learning?.germanCourses?.subtitle || "Whether you're just starting or need focused training for the medical field, our language programs are built with your goals in mind."}</p>
            <div className="mb-4">
              <p className="font-medium text-sm text-primary mb-4">✅ What's included:</p>
              <ul className="space-y-0">
                {renderFeatureList(germanCourseFeatures)}
              </ul>
            </div>
          </div>

          {/* FSP Courses */}
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t?.learning?.fspCourses?.title || "FSP Preparation Courses"}</h3>
            <p className="text-gray-600 mb-4">{t?.learning?.fspCourses?.subtitle || "The Fachsprachprüfung (FSP) is a specialized language and communication exam required for Approbation. We've created a full support system to help you succeed—on your first try."}</p>
            <div className="mb-4">
              <p className="font-medium text-sm text-primary mb-4">✅ What's included:</p>
              <ul className="space-y-0">
                {renderFeatureList(fspCourseFeatures)}
              </ul>
            </div>
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
