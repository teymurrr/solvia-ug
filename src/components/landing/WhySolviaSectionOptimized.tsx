import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, FileCheck2, Users, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/hooks/useLanguage';
import { Link } from 'react-router-dom';

const WhySolviaSectionOptimized = () => {
  const { t } = useLanguage();
  
  const benefits = [
    {
      icon: Briefcase,
      titleKey: 'directHiring',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: FileCheck2,
      titleKey: 'fastProcess',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Shield,
      titleKey: 'verifiedProfiles',
      color: 'from-purple-500 to-violet-500',
    },
    {
      icon: Users,
      titleKey: 'transparentProcess',
      color: 'from-orange-500 to-amber-500',
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-muted/30 via-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Title, Description, Stats, and Button */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-foreground leading-tight">
                {t?.why?.heading || "Here's what makes us different from traditional recruitment agencies"}
              </h2>
              
              <p className="text-lg md:text-xl text-muted-foreground">
                {t?.why?.description || "At Solvia, we are passionate about connecting professionals around the world with institutions directly, without middlemen."}
              </p>
              
              <div className="flex gap-8 md:gap-12 mt-8">
                <div>
                  <span className="text-5xl md:text-6xl lg:text-[70px] font-bold text-primary">200+</span>
                  <p className="text-muted-foreground text-base md:text-lg">{t?.vacancies?.positions || "Active Positions"}</p>
                </div>
                <div>
                  <span className="text-5xl md:text-6xl lg:text-[70px] font-bold text-primary">1000+</span>
                  <p className="text-muted-foreground text-base md:text-lg">{t?.professionals?.title || "Professionals"}</p>
                </div>
              </div>
            </div>
            
            <div>
              <Button asChild className="px-8">
                <Link to="/about">{t?.common?.about || "About Us"}</Link>
              </Button>
            </div>
          </div>
          
          {/* Right Column: Feature Cards */}
          <div className="space-y-4">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              const title = t?.why?.[benefit.titleKey]?.title || benefit.titleKey;
              const description = t?.why?.[benefit.titleKey]?.description || '';
              
              return (
                <Card 
                  key={index}
                  className="border-0 bg-card/80 hover:bg-card hover:shadow-lg transition-all duration-300 group"
                >
                  <CardContent className="p-4 md:p-5 flex items-start gap-4">
                    <div className={`bg-gradient-to-r ${benefit.color} p-3 rounded-xl w-12 h-12 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold mb-1 text-foreground">{title}</h3>
                      <p className="text-muted-foreground text-sm md:text-base">
                        {description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySolviaSectionOptimized;
