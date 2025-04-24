import React, { useState, useEffect } from 'react';
import { FileCheck, Building2, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  // Steps data with titles, descriptions, and image information
  const steps = [
    {
      icon: <FileCheck className="h-6 w-6 text-[#006ae6]" />,
      title: "Create Your Profile",
      description: "Fill in your professional details, certifications, and preferences",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80",
      alt: "Person creating healthcare profile on laptop"
    },
    {
      icon: <Building2 className="h-6 w-6 text-[#006ae6]" />,
      title: "Match with Employers",
      description: "Connect with healthcare institutions matching your skills and preferences",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80",
      alt: "Healthcare professionals reviewing job matches"
    },
    {
      icon: <Rocket className="h-6 w-6 text-[#006ae6]" />,
      title: "Start Your Journey",
      description: "Begin your new role with relocation support and comprehensive onboarding",
      image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80",
      alt: "Healthcare professional receiving job offer"
    }
  ];

  // Auto-scroll through steps every 5 seconds if no hover is active
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-[30px] font-bold text-black text-center mb-12">How it Works</h2>
        
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* Left section - Steps names that trigger on hover */}
          <div className="lg:w-1/2 space-y-6">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={cn(
                  "p-6 rounded-lg transition-all duration-300 transform cursor-pointer",
                  activeStep === index 
                    ? "bg-blue-50 border-l-4 border-[#006ae6] translate-x-2" 
                    : "hover:bg-gray-50"
                )}
                onMouseEnter={() => setActiveStep(index)}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-2 rounded-full transition-colors",
                    activeStep === index ? "bg-[#006ae6]/10" : "bg-gray-100"
                  )}>
                    {step.icon}
                  </div>
                  <div>
                    <h3 className={cn(
                      "text-xl font-semibold mb-1 transition-colors",
                      activeStep === index ? "text-[#006ae6]" : "text-gray-800"
                    )}>
                      {step.title}
                    </h3>
                    <p className={cn(
                      "text-sm transition-colors",
                      activeStep === index ? "text-gray-700" : "text-gray-500"
                    )}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Right section - Visual representations */}
          <div className="lg:w-1/2 relative h-[400px] mt-8 lg:mt-0">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={cn(
                  "absolute inset-0 rounded-xl overflow-hidden transition-all duration-500",
                  activeStep === index 
                    ? "opacity-100 translate-x-0" 
                    : "opacity-0 translate-x-8 pointer-events-none"
                )}
              >
                <div className="relative h-full w-full">
                  <img 
                    src={step.image} 
                    alt={step.alt}
                    className="object-cover h-full w-full rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
                    {index === 0 && (
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 transform animate-fade-in">
                        <h4 className="font-semibold text-lg">Healthcare Professional Profile</h4>
                        <div className="flex gap-2 items-center text-sm text-gray-600 mt-1">
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          <span>Create your medical career path</span>
                        </div>
                      </div>
                    )}
                    
                    {index === 1 && (
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 transform animate-fade-in">
                        <h4 className="font-semibold text-lg">Vacancy Matches</h4>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">10+ matches</span>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">High match rate</span>
                        </div>
                      </div>
                    )}
                    
                    {index === 2 && (
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 transform animate-fade-in">
                        <h4 className="font-semibold text-lg text-center">Job Offer</h4>
                        <div className="flex justify-center mt-2">
                          <span className="inline-block bg-green-500 text-white px-4 py-2 rounded-lg font-semibold animate-pulse">
                            Congratulations!
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Navigation dots */}
            <div className="absolute -bottom-10 left-0 right-0 flex justify-center gap-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all",
                    activeStep === index ? "bg-[#006ae6] w-5" : "bg-gray-300"
                  )}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
