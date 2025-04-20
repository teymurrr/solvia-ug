
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Globe, GraduationCap, ArrowRight } from 'lucide-react';

const LearningSection = () => {
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Solvia Learning</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Enhance your medical career with specialized German language and FSP courses designed for healthcare professionals
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="text-left">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">German Language Courses</h3>
                    <p className="text-muted-foreground">
                      Master medical German with our specialized courses, from basic to advanced levels
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="text-left">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">FSP Preparation</h3>
                    <p className="text-muted-foreground">
                      Comprehensive preparation for your medical license examination in Germany
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Button size="lg" className="mt-6" asChild>
            <Link to="/learning" className="flex items-center">
              Explore Courses
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LearningSection;
