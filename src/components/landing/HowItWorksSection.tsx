
import React from 'react';
import { Globe, GraduationCap, Briefcase, Plane } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from '@/hooks/useLanguage';

const HowItWorksSection = () => {
  const { t } = useLanguage();
  
  const steps = [
    {
      icon: <Globe className="h-10 w-10 text-primary" />,
      step: "01",
      title: t?.howItWorks?.steps?.step1?.title || "Explore Offers by Country",
      description: t?.howItWorks?.steps?.step1?.description || "Choose your destination and see real opportunities for your specialty."
    },
    {
      icon: <GraduationCap className="h-10 w-10 text-primary" />,
      step: "02",
      title: t?.howItWorks?.steps?.step2?.title || "Homologate Your Title",
      description: t?.howItWorks?.steps?.step2?.description || "We guide you step by step to complete the process."
    },
    {
      icon: <Briefcase className="h-10 w-10 text-primary" />,
      step: "03",
      title: t?.howItWorks?.steps?.step3?.title || "Apply to the Best Offers",
      description: t?.howItWorks?.steps?.step3?.description || "We connect you with hospitals and companies looking for your profile."
    },
    {
      icon: <Plane className="h-10 w-10 text-primary" />,
      step: "04",
      title: t?.howItWorks?.steps?.step4?.title || "Start Working in Europe",
      description: t?.howItWorks?.steps?.step4?.description || "We support you with interviews, contracts, and relocation."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t?.howItWorks?.title || "How It Works"}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t?.howItWorks?.subtitle || "Your path to a medical career in Europe, simplified."}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="relative border-0 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 pt-8">
                <div className="absolute -top-4 left-6 bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded-full">
                  {step.step}
                </div>
                <div className="flex justify-center mb-5">
                  <div className="p-3 rounded-full bg-primary/10">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-center">{step.title}</h3>
                <p className="text-muted-foreground text-sm text-center leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
