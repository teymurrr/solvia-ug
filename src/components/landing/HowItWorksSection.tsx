
import React from 'react';
import { FileCheck, Building2, Rocket } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <FileCheck className="h-12 w-12 text-[#006ae6]" />,
      title: "Create Your Profile",
      description: "Fill in your professional details, certifications, and preferences to showcase your expertise."
    },
    {
      icon: <Building2 className="h-12 w-12 text-[#006ae6]" />,
      title: "Match with Employers",
      description: "Connect with healthcare institutions that match your skills and career preferences."
    },
    {
      icon: <Rocket className="h-12 w-12 text-[#006ae6]" />,
      title: "Start Your Journey",
      description: "Begin your new role with comprehensive support for relocation and onboarding."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="text-center border-transparent hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
