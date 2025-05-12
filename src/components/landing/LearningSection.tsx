
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, GraduationCap, Globe, Clock } from 'lucide-react';
import { useProtectedAction } from '@/hooks/useProtectedAction';
import { useLanguage } from '@/hooks/useLanguage';

const LearningSection = () => {
  const { handleProtectedAction } = useProtectedAction();
  const { t } = useLanguage();
  
  // Default values in case translations aren't loaded yet
  const title = t?.learning?.title || "Solvia Learning";
  const subtitle = t?.learning?.subtitle || "Enhance your medical career with our specialized German language and FSP courses";
  
  const germanCoursesTitle = t?.learning?.germanCourses?.title || "German Language Courses";
  const germanCoursesSubtitle = t?.learning?.germanCourses?.subtitle || "Master medical German with our specialized courses";
  const germanCoursesFeatures = t?.learning?.germanCourses?.features || [
    'Basic to Advanced Medical German',
    'Flexible Learning Schedule',
    'Telc Medical Preparation'
  ];
  
  const fspCoursesTitle = t?.learning?.fspCourses?.title || "FSP Preparation Courses";
  const fspCoursesSubtitle = t?.learning?.fspCourses?.subtitle || "Comprehensive preparation for your medical license in Germany";
  const fspCoursesFeatures = t?.learning?.fspCourses?.features || [
    'Complete FSP Study Materials',
    'Practice Examinations',
    'One-on-One Mentoring'
  ];
  
  const exploreCourses = t?.learning?.exploreCourses || "Explore Courses";

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-6 mb-12">
            <h2 className="text-[42px] font-bold text-gray-900 leading-tight">
              {title}
            </h2>
            <p className="text-[20px] text-gray-600">
              {subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card className="relative overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-transparent">
              <div className="absolute top-4 right-4">
                <Badge variant="comingSoon">Coming Soon</Badge>
              </div>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{germanCoursesTitle}</CardTitle>
                <CardDescription>{germanCoursesSubtitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mt-2">
                  {germanCoursesFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-transparent">
              <div className="absolute top-4 right-4">
                <Badge variant="comingSoon">Coming Soon</Badge>
              </div>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{fspCoursesTitle}</CardTitle>
                <CardDescription>{fspCoursesSubtitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mt-2">
                  {fspCoursesFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="text-left">
            <Button 
              size="lg" 
              asChild 
              onClick={() => handleProtectedAction(undefined, '/signup/professional')}
            >
              <Link to="/signup/professional" className="flex items-center justify-center">
                {exploreCourses}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearningSection;
