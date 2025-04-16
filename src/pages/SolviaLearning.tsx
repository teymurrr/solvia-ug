
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SolviaLearning = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Solvia Learning</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enhance your medical career with our specialized language and certification courses
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-8">
              <div className="mb-4">
                <Badge className="bg-blue-500">German Language</Badge>
              </div>
              <CardTitle className="text-2xl">Dearman Medical German</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Specialized German language courses for medical professionals.
                  Master medical terminology and communication skills needed for
                  your career in German-speaking countries.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                    Medical terminology focus
                  </li>
                  <li className="flex items-center text-sm">
                    <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                    Patient communication
                  </li>
                  <li className="flex items-center text-sm">
                    <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                    Hospital workplace German
                  </li>
                </ul>
                <Button className="w-full mt-4" disabled>
                  Coming Soon <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="pb-8">
              <div className="mb-4">
                <Badge className="bg-green-500">Certification</Badge>
              </div>
              <CardTitle className="text-2xl">FSP Preparation Course</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Comprehensive preparation for the Swiss Federal Specialized Physician (FSP)
                  examination. Get ready to practice medicine in Switzerland with our
                  expert-led courses.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm">
                    <GraduationCap className="h-4 w-4 mr-2 text-green-500" />
                    Exam preparation materials
                  </li>
                  <li className="flex items-center text-sm">
                    <GraduationCap className="h-4 w-4 mr-2 text-green-500" />
                    Practice questions
                  </li>
                  <li className="flex items-center text-sm">
                    <GraduationCap className="h-4 w-4 mr-2 text-green-500" />
                    Mock examinations
                  </li>
                </ul>
                <Button className="w-full mt-4" disabled>
                  Coming Soon <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Our courses are being carefully developed to meet the highest standards.
            Stay tuned for the launch!
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default SolviaLearning;
