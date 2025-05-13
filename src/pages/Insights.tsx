
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ChartBar, Users, Network } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const Insights = () => {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">{t?.insights?.title || "Solvia Insights"}</h1>
            <p className="text-lg text-muted-foreground">
              {t?.insights?.subtitle || "Comprehensive solutions for healthcare institutions"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Employee Experience & Wellbeing */}
            <Card className="relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge variant="comingSoon">{t?.insights?.comingSoon || "Coming Soon"}</Badge>
              </div>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
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

            {/* Analytics & Strategic Services */}
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

            {/* Talent Development */}
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

            {/* Community & Networking */}
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
        </div>
      </div>
    </MainLayout>
  );
};

export default Insights;
