
import React, { useState, useEffect } from 'react';
import { Users, FileText, Calendar } from 'lucide-react';

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    {
      icon: <Users className="h-12 w-12 text-blue-500" />,
      title: "Search",
      description: "Use filters to find the exact match you need.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80"
    },
    {
      icon: <FileText className="h-12 w-12 text-blue-500" />,
      title: "Connect",
      description: "Click to view a CV or schedule an interview.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80"
    },
    {
      icon: <Calendar className="h-12 w-12 text-blue-500" />,
      title: "Hire",
      description: "We assist with onboarding, relocation, and integration.",
      image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-[30px] font-bold text-center mb-16">
          Partner with <span className="text-blue-500">Solvia</span>
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
          {/* Left section - Steps list */}
          <div className="lg:w-1/2 space-y-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg transition-all duration-300 cursor-pointer ${
                  activeStep === index 
                    ? "bg-blue-50 border-l-4 border-blue-500 transform translate-x-2" 
                    : "hover:bg-gray-50"
                }`}
                onMouseEnter={() => setActiveStep(index)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${
                    activeStep === index ? "bg-blue-100" : "bg-gray-100"
                  }`}>
                    {step.icon}
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold mb-1 ${
                      activeStep === index ? "text-blue-500" : ""
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Right section - Image preview */}
          <div className="lg:w-1/2 relative h-[400px]">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`absolute inset-0 rounded-xl overflow-hidden transition-all duration-500 ${
                  activeStep === index 
                    ? "opacity-100 translate-x-0" 
                    : "opacity-0 translate-x-8 pointer-events-none"
                }`}
              >
                <img 
                  src={step.image}
                  alt={`Step ${index + 1}: ${step.title}`}
                  className="object-cover h-full w-full rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
