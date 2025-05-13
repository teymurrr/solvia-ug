
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, ChartBar, Users, Network } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const InsightsSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-6 mb-8 text-center">
            <h2 className="text-[42px] font-bold text-gray-900 leading-tight">
              {t?.insights?.title || "Solvia Insights"}
            </h2>
            <p className="text-[20px] text-gray-600">
              {t?.insights?.subtitle || "Comprehensive solutions for healthcare institutions"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card className="relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge variant="comingSoon">{t?.insights?.comingSoon || "Coming Soon"}</Badge>
              </div>
              <CardHeader>
                <div className="h-12 w-12 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-[#0EA5E9]" />
                </div>
                <CardTitle>{t?.insights?.employeeExperience?.title || "Employee Experience & Wellbeing"}</CardTitle>
                <CardDescription>{t?.insights?.employeeExperience?.subtitle || "Enhance workplace satisfaction and employee wellness"}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t?.insights?.employeeExperience?.description || "Comprehensive programs designed to improve employee satisfaction, mental health support, and work-life balance initiatives."}
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge variant="comingSoon">{t?.insights?.comingSoon || "Coming Soon"}</Badge>
              </div>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <ChartBar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t?.insights?.analytics?.title || "Analytics & Strategic Services"}</CardTitle>
                <CardDescription>{t?.insights?.analytics?.subtitle || "Data-driven healthcare workforce solutions"}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t?.insights?.analytics?.description || "Advanced analytics and strategic planning services to optimize workforce management and operational efficiency."}
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge variant="comingSoon">{t?.insights?.comingSoon || "Coming Soon"}</Badge>
              </div>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t?.insights?.talentDevelopment?.title || "Talent Development Services"}</CardTitle>
                <CardDescription>{t?.insights?.talentDevelopment?.subtitle || "Grow and nurture healthcare talent"}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t?.insights?.talentDevelopment?.description || "Customized training programs and professional development paths to enhance healthcare workforce capabilities."}
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge variant="comingSoon">{t?.insights?.comingSoon || "Coming Soon"}</Badge>
              </div>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Network className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t?.insights?.community?.title || "Community & Networking"}</CardTitle>
                <CardDescription>{t?.insights?.community?.subtitle || "Connect with healthcare professionals"}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t?.insights?.community?.description || "Build valuable connections within the healthcare community through networking events and professional forums."}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center">
            <Button variant="outline" asChild className="group border-primary text-primary hover:bg-primary/10">
              <Link to="/insights" className="flex items-center">
                {t?.common?.viewMore || "View More"}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsightsSection;
