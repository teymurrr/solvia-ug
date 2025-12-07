import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, GraduationCap, Globe, Award, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const LearningSectionCompact = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 bg-gradient-to-br from-card via-card to-primary/5 shadow-lg overflow-hidden">
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Left: Content */}
                <div className="flex-1 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/10 rounded-full">
                    <GraduationCap className="h-4 w-4 text-secondary" />
                    <span className="text-xs font-medium text-secondary uppercase tracking-wide">
                      {t?.learning?.additionalSupport || "Additional Support"}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                    {t?.learning?.prepareForSuccess || "Prepare for Success in Germany"}
                  </h3>
                  
                  <p className="text-muted-foreground">
                    {t?.learning?.compactDescription || "Master Medical German and pass your FSP exam with our specialized courses."}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 pt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-primary" />
                      <span>{t?.learning?.germanCourses?.shortTitle || "German A1-C1"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-primary" />
                      <span>{t?.learning?.fspCourses?.shortTitle || "FSP Prep"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>95% {t?.learning?.passRate || "pass rate"}</span>
                    </div>
                  </div>
                </div>
                
                {/* Right: CTA */}
                <div className="flex-shrink-0">
                  <Button size="lg" asChild className="group">
                    <Link to="/learning" className="flex items-center gap-2">
                      {t?.learning?.exploreCourses || "Explore Courses"}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LearningSectionCompact;
