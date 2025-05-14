
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, GraduationCap, Globe, Clock } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const SolviaLearning = () => {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">{t?.learning?.title || "Solvia Learning"}</h1>
            <p className="text-lg text-muted-foreground">
              {t?.learning?.subtitle || "Enhance your medical career with our specialized German language and FSP courses"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* German Language Courses */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge variant="comingSoon">{t?.insights?.comingSoon || "Coming Soon"}</Badge>
              </div>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t?.learning?.germanCourses?.title || "German Language Courses"}</CardTitle>
                <CardDescription>{t?.learning?.germanCourses?.subtitle || "Master medical German with our specialized courses"}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>{t?.learning?.germanCourses?.features?.[0] || "Basic to Advanced Medical German"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{t?.learning?.germanCourses?.features?.[1] || "Flexible Learning Schedule"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <span>{t?.learning?.germanCourses?.features?.[2] || "Telc Medical Preparation"}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* FSP Courses */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge variant="comingSoon">{t?.insights?.comingSoon || "Coming Soon"}</Badge>
              </div>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t?.learning?.fspCourses?.title || "FSP Preparation Courses"}</CardTitle>
                <CardDescription>{t?.learning?.fspCourses?.subtitle || "Comprehensive preparation for your medical license in Germany"}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>{t?.learning?.fspCourses?.features?.[0] || "Complete FSP Study Materials"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{t?.learning?.fspCourses?.features?.[1] || "Practice Examinations"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <span>{t?.learning?.fspCourses?.features?.[2] || "One-on-One Mentoring"}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SolviaLearning;
