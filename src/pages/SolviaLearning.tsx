
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
                <CardDescription>{t?.learning?.germanCourses?.subtitle || "Whether you're just starting or need focused training for the medical field, our language programs are built with your goals in mind."}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="font-medium text-sm text-primary mb-3">✅ What's included:</p>
                  <ul className="space-y-3">
                    {(t?.learning?.germanCourses?.features || [
                      "General + Medical German Levels A1 to C1 - Structured curriculum from beginner to advanced with medical vocabulary included from the early stages.",
                      "Flexible Learning Options - Choose between live online classes, self-paced modules, or hybrid formats—designed for professionals with busy schedules.",
                      "TELC B2-C1 Medizin Preparation - Get targeted practice for the most recognized medical language exam, accepted across Germany.",
                      "Interactive Practice Tools - Vocabulary flashcards, pronunciation drills, and doctor-patient conversation simulations.",
                      "Progress Tracking - Follow your learning milestones and get reminders for practice sessions, assignments, and exams."
                    ]).map((feature, index) => {
                      const [title, description] = feature.split(' - ');
                      return (
                        <li key={index} className="text-sm">
                          <span className="font-medium text-gray-900">{title}</span>
                          {description && <span className="text-gray-600"> - {description}</span>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
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
                <CardDescription>{t?.learning?.fspCourses?.subtitle || "The Fachsprachprüfung (FSP) is a specialized language and communication exam required for Approbation. We've created a full support system to help you succeed—on your first try."}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="font-medium text-sm text-primary mb-3">✅ What's included:</p>
                  <ul className="space-y-3">
                    {(t?.learning?.fspCourses?.features || [
                      "Complete FSP Curriculum - Structured lessons that mirror the real exam format: anamnesis, findings discussion, and doctor-to-doctor communication.",
                      "Practice Examinations - Multiple full-length mock FSP exams with feedback from certified trainers.",
                      "One-on-One Mentoring - Access personal feedback from medical professionals who've passed the FSP themselves.",
                      "Real-life Case Scenarios - Train with realistic clinical cases to build both vocabulary and confidence.",
                      "Exam Simulation App (Coming soon) - Practice anytime with our digital tool that simulates the FSP environment."
                    ]).map((feature, index) => {
                      const [title, description] = feature.split(' - ');
                      return (
                        <li key={index} className="text-sm">
                          <span className="font-medium text-gray-900">{title}</span>
                          {description && <span className="text-gray-600"> - {description}</span>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SolviaLearning;
