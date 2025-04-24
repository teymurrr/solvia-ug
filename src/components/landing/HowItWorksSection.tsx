
import React, { useState, useEffect, useRef } from 'react';
import { UserPlus, Building, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !stepsContainerRef.current) return;

      const { top: sectionTop } = sectionRef.current.getBoundingClientRect();
      const { height: containerHeight } = stepsContainerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollProgress = -sectionTop / (containerHeight - windowHeight);
      
      const stepIndex = Math.min(
        Math.floor(scrollProgress * steps.length),
        steps.length - 1
      );
      
      if (stepIndex >= 0 && stepIndex !== activeStep) {
        setActiveStep(stepIndex);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeStep, steps.length]);

  return (
    <section 
      ref={sectionRef}
      id="how-it-works-section"
      className="relative bg-white"
      style={{ height: `${100 * steps.length}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How it Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your healthcare career journey in three simple steps
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
            {/* Left section - Steps */}
            <div 
              ref={stepsContainerRef}
              className="lg:w-2/5 space-y-4"
            >
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className={cn(
                    "p-6 rounded-xl transition-all duration-500",
                    activeStep === index 
                      ? "bg-gradient-to-r from-blue-50 to-blue-100/50 shadow-sm translate-x-2" 
                      : "opacity-40",
                    activeStep === index && "after:absolute after:left-0 after:top-0 after:h-full after:w-1 after:bg-primary after:rounded-l-lg"
                  )}
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
                        "text-xl font-semibold mb-2",
                        activeStep === index ? "text-primary" : "text-gray-800"
                      )}>
                        {step.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      
                      <div className={cn(
                        "space-y-2",
                        activeStep === index ? "opacity-100" : "opacity-0",
                        "transition-opacity duration-300"
                      )}>
                        {step.features.map((feature, fIdx) => (
                          <div key={fIdx} className="flex items-center text-sm text-gray-700 gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right section - Images */}
            <div className="lg:w-3/5 relative h-[450px] rounded-2xl overflow-hidden shadow-lg">
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
