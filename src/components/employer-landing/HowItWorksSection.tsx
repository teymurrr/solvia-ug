
import React from 'react';
import { Users, FileText, Calendar } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <Users className="h-12 w-12 text-blue-500" />,
      title: "Search",
      description: "Use filters to find the exact match you need."
    },
    {
      icon: <FileText className="h-12 w-12 text-blue-500" />,
      title: "Connect",
      description: "Click to view a CV or schedule an interview."
    },
    {
      icon: <Calendar className="h-12 w-12 text-blue-500" />,
      title: "Hire",
      description: "We assist with onboarding, relocation, and integration."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-[30px] font-bold text-center mb-16">
          Partner with <span className="text-blue-500">Solvia</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-6 bg-blue-50 p-4 rounded-full">
                {step.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-4">
                {index === 1 ? (
                  <span className="text-blue-500">{step.title}</span>
                ) : (
                  step.title
                )}
              </h3>
              <p className="text-gray-600 text-lg">
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
