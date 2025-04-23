import React from 'react';
import { FileCheck, Clock, Building2, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <FileCheck className="h-6 w-6 text-[#006ae6]" />,
      title: "Create Your Profile",
      description: "Fill in your professional details, certifications, and preferences"
    },
    {
      icon: <CheckCircle2 className="h-6 w-6 text-[#006ae6]" />,
      title: "Get Verified",
      description: "Our team verifies your credentials and language proficiency"
    },
    {
      icon: <Building2 className="h-6 w-6 text-[#006ae6]" />,
      title: "Match with Employers",
      description: "Connect with healthcare institutions"
    },
    {
      icon: <Calendar className="h-6 w-6 text-[#006ae6]" />,
      title: "Start Your Journey",
      description: "Begin your new role in a new country with full support from our team"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Clock className="h-[30px] w-[30px] text-[#006ae6] mx-auto mb-4" />
          <h2 className="text-[30px] font-bold text-black">How it Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your journey to working in a new country made simple and straightforward
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative h-full">
              <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors h-[240px] justify-center">
                <div className="p-4 rounded-full mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-[#0EA5E9] h-8 w-8" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
