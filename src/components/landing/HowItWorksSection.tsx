
import React, { useState, useEffect } from 'react';
import { UserPlus, Building, Rocket, ArrowRight, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();
  
  // Steps data with titles, descriptions, and image information
  const steps = [
    {
      icon: <UserPlus className="h-6 w-6 text-primary" />,
      title: "Create Your Profile",
      description: "Fill in your professional details, certifications, and preferences to find the perfect healthcare opportunities",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80",
      alt: "Person creating healthcare profile on laptop",
      features: ["Personal information", "Professional credentials", "Geographic preferences"]
    },
    {
      icon: <Building className="h-6 w-6 text-primary" />,
      title: "Match with Employers",
      description: "Our advanced algorithm connects you with healthcare institutions that match your skills and preferences",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80",
      alt: "Healthcare professionals reviewing job matches",
      features: ["AI-powered matching", "Direct communication", "Tailored recommendations"]
    },
    {
      icon: <Rocket className="h-6 w-6 text-primary" />,
      title: "Start Your Journey",
      description: "Begin your new role with comprehensive relocation support and seamless onboarding",
      image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80",
      alt: "Healthcare professional receiving job offer",
      features: ["Relocation assistance", "Visa support", "Onboarding guidance"]
    }
  ];

  // Observer for scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    
    const section = document.getElementById("how-it-works-section");
    if (section) {
      observer.observe(section);
    }
    
    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  // Auto-scroll through steps every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section 
      id="how-it-works-section"
      className="py-20 bg-white overflow-hidden"
    >
      <div className={cn(
        "container mx-auto px-4 transition-all duration-1000 transform",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}>
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How it Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your healthcare career journey in three simple steps
          </p>
        </div>
        
        <div className={cn(
          "flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto",
          isMobile ? "items-center" : "items-start"
        )}>
          {/* Left section - Steps navigation */}
          <div className="lg:w-2/5 space-y-4">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={cn(
                  "p-6 rounded-xl transition-all duration-500 transform cursor-pointer relative",
                  activeStep === index 
                    ? "bg-gradient-to-r from-blue-50 to-blue-100/50 shadow-sm translate-x-2" 
                    : "hover:bg-blue-50/50",
                  activeStep === index && "after:absolute after:left-0 after:top-0 after:h-full after:w-1 after:bg-primary after:rounded-l-lg"
                )}
                onMouseEnter={() => setActiveStep(index)}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-3 rounded-full transition-colors",
                    activeStep === index ? "bg-primary/10" : "bg-gray-100"
                  )}>
                    {step.icon}
                  </div>
                  <div>
                    <h3 className={cn(
                      "text-xl font-semibold mb-1 transition-colors",
                      activeStep === index ? "text-primary" : "text-gray-800"
                    )}>
                      {step.title}
                    </h3>
                    <p className={cn(
                      "text-sm mb-2 transition-colors",
                      activeStep === index ? "text-gray-700" : "text-gray-500"
                    )}>
                      {step.description}
                    </p>
                    
                    {activeStep === index && (
                      <div className="mt-3 space-y-2 animate-fade-in">
                        {step.features.map((feature, fIdx) => (
                          <div key={fIdx} className="flex items-center text-sm text-gray-700 gap-2">
                            <CheckCircle className="h-4 w-4 text-primary/80" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Right section - Visual representations */}
          <div className="lg:w-3/5 relative h-[450px] mt-8 lg:mt-0 rounded-2xl overflow-hidden shadow-lg">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={cn(
                  "absolute inset-0 rounded-2xl overflow-hidden transition-all duration-700",
                  activeStep === index 
                    ? "opacity-100 translate-x-0 scale-100" 
                    : "opacity-0 translate-x-8 scale-95 pointer-events-none"
                )}
                aria-hidden={activeStep !== index}
              >
                <div className="relative h-full w-full bg-gradient-to-b from-blue-900/5 to-blue-900/30">
                  <img 
                    src={step.image} 
                    alt={step.alt}
                    className="object-cover h-full w-full rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8">
                    {index === 0 && (
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 transform animate-fade-in shadow-lg border border-blue-100">
                        <h4 className="font-semibold text-lg text-gray-900">Healthcare Professional Profile</h4>
                        <div className="flex gap-2 items-center text-sm text-gray-700 mt-2">
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          <span>Complete your profile to increase match rate by 85%</span>
                        </div>
                        <button className="mt-3 text-primary flex items-center text-sm font-medium hover:underline">
                          Get started <ArrowRight className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    )}
                    
                    {index === 1 && (
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 transform animate-fade-in shadow-lg border border-blue-100">
                        <h4 className="font-semibold text-lg text-gray-900">Vacancy Matches</h4>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">10+ matches</span>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">High match rate</span>
                        </div>
                        <div className="mt-3 flex justify-between">
                          <span className="text-sm text-gray-600">Match score: 92%</span>
                          <button className="text-primary flex items-center text-sm font-medium hover:underline">
                            View matches <ArrowRight className="h-4 w-4 ml-1" />
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {index === 2 && (
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 transform animate-fade-in shadow-lg border border-blue-100">
                        <h4 className="font-semibold text-lg text-center text-gray-900">Job Offer</h4>
                        <div className="flex justify-center mt-3">
                          <span className="inline-block bg-primary text-white px-4 py-2 rounded-lg font-semibold animate-pulse">
                            Congratulations!
                          </span>
                        </div>
                        <p className="text-center text-sm text-gray-600 mt-2">
                          Your relocation journey begins now
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Navigation dots */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all",
                    activeStep === index ? "bg-primary w-5" : "bg-white/60"
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
