import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, GraduationCap, Globe, Clock, Lightbulb } from 'lucide-react';
import { useProtectedAction } from '@/hooks/useProtectedAction';

const LearningSection = () => {
  const { handleProtectedAction } = useProtectedAction();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-primary mb-4">Solvia Learning</h2>
            <p className="text-lg text-muted-foreground">
              Enhance your medical career with our specialized German language and FSP courses
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
                <CardTitle>German Language Courses</CardTitle>
                <CardDescription>Master medical German with our specialized courses</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mt-2">
                  <li className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>Basic to Advanced Medical German</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Flexible Learning Schedule</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <span>Telc Medical Preparation</span>
                  </li>
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
                <CardTitle>FSP Preparation Courses</CardTitle>
                <CardDescription>Comprehensive preparation for your medical license in Germany</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mt-2">
                  <li className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>Complete FSP Study Materials</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Practice Examinations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <span>One-on-One Mentoring</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="text-center">
            <Button 
              size="lg" 
              asChild 
              onClick={() => handleProtectedAction(undefined, '/signup/professional')}
            >
              <Link to="/signup/professional" className="flex items-center justify-center">
                Explore Courses
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearningSection;
