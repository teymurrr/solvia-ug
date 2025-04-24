
import React, { useState, useEffect, useRef } from 'react';
import { UserPlus, Building, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isMobile = useIsMobile();

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
    
    const section = sectionRef.current;
    if (section) {
      observer.observe(section);
    }
    
    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const container = sectionRef.current;
      if (!container) return;

      const containerTop = container.offsetTop;
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      let newActiveStep = 0;
      stepsRefs.current.forEach((ref, index) => {
        if (!ref) return;
        const elementTop = ref.offsetTop;
        if (scrollPosition >= containerTop + elementTop) {
          newActiveStep = index;
        }
      });

      setActiveStep(newActiveStep);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="how-it-works-section"
      className="py-20 bg-white overflow-hidden min-h-screen"
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
          {/* Left section - Scrollable steps */}
          <div className="lg:w-2/5 space-y-4 sticky top-20">
            {steps.map((step, index) => (
              <div 
                key={index}
                ref={el => stepsRefs.current[index] = el}
                className={cn(
                  "p-6 rounded-xl transition-all duration-500 transform cursor-pointer relative",
                  activeStep === index 
                    ? "bg-gradient-to-r from-blue-50 to-blue-100/50 shadow-sm translate-x-2" 
                    : "hover:bg-blue-50/50",
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
                    
                    <div className={cn(
                      "mt-3 space-y-2",
                      activeStep === index ? "animate-fade-in" : "opacity-0"
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
          <div className="lg:w-3/5 relative h-[450px] mt-8 lg:mt-0 rounded-2xl overflow-hidden shadow-lg sticky top-20">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
