
import React, { useState, useEffect } from 'react';
import { Users, Building2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  // Steps data with titles, descriptions, and icons
  const steps = [
    {
      icon: <Users className="h-8 w-8 text-[#006ae6]" />,
      title: "Search",
      description: "Use filters to find the exact match you need."
    },
    {
      icon: <Building2 className="h-8 w-8 text-[#006ae6]" />,
      title: "Connect",
      description: "Click to view a CV or schedule an interview."
    },
    {
      icon: <Calendar className="h-8 w-8 text-[#006ae6]" />,
      title: "Hire",
      description: "We assist with onboarding, relocation, and integration."
    }
  ];

  // Auto-scroll through steps every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section className="py-16 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-[30px] font-bold text-white text-center mb-12">
          Partner with <span className="text-blue-400">Solvia</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={cn(
                "text-center transition-all duration-300",
                activeStep === index ? "scale-105" : ""
              )}
              onMouseEnter={() => setActiveStep(index)}
            >
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors",
                activeStep === index ? "bg-blue-900" : "bg-gray-800"
              )}>
                {step.icon}
              </div>
              <h3 className={cn(
                "text-xl font-semibold mb-2 transition-colors",
                activeStep === index ? "text-blue-400" : "text-gray-200"
              )}>
                {step.title}
              </h3>
              <p className={cn(
                "transition-colors",
                activeStep === index ? "text-gray-300" : "text-gray-400"
              )}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
