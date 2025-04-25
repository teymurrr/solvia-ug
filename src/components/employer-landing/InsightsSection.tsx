
import React from 'react';
import { Heart, ChartBar, Users, Network, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const InsightsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Lightbulb className="h-[30px] w-[30px] text-blue-400" />
            </div>
            <h2 className="text-[30px] font-bold text-white">
              <span className="text-blue-400">Solvia</span> Insights
            </h2>
            <p className="text-lg text-gray-300">
              Comprehensive solutions for healthcare institutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="relative overflow-hidden border-transparent hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
              <div className="absolute top-4 right-4">
                <Badge variant="comingSoon">Coming Soon</Badge>
              </div>
              <CardHeader>
                <div className="h-12 w-12 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-[#006ae6]" />
                </div>
                <CardTitle>Employee Experience & Wellbeing</CardTitle>
                <CardDescription>Enhance workplace satisfaction and employee wellness</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comprehensive programs designed to improve employee satisfaction, 
                  mental health support, and work-life balance initiatives.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-transparent hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
              <div className="absolute top-4 right-4">
                <Badge variant="comingSoon">Coming Soon</Badge>
              </div>
              <CardHeader>
                <div className="h-12 w-12 flex items-center justify-center mb-4">
                  <ChartBar className="h-6 w-6 text-[#006ae6]" />
                </div>
                <CardTitle>Analytics & Strategic Services</CardTitle>
                <CardDescription>Data-driven healthcare workforce solutions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced analytics and strategic planning services to optimize 
                  workforce management and operational efficiency.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-transparent hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
              <div className="absolute top-4 right-4">
                <Badge variant="comingSoon">Coming Soon</Badge>
              </div>
              <CardHeader>
                <div className="h-12 w-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-[#006ae6]" />
                </div>
                <CardTitle>Talent Development Services</CardTitle>
                <CardDescription>Grow and nurture healthcare talent</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Customized training programs and professional development paths 
                  to enhance healthcare workforce capabilities.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-transparent hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
              <div className="absolute top-4 right-4">
                <Badge variant="comingSoon">Coming Soon</Badge>
              </div>
              <CardHeader>
                <div className="h-12 w-12 flex items-center justify-center mb-4">
                  <Network className="h-6 w-6 text-[#006ae6]" />
                </div>
                <CardTitle>Community & Networking</CardTitle>
                <CardDescription>Connect with healthcare professionals</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Build valuable connections within the healthcare community through 
                  networking events and professional forums.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsightsSection;
