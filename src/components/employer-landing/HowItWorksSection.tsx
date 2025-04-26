
import React from 'react';
import { 
  Stepper, 
  StepperIndicator, 
  StepperItem, 
  StepperSeparator, 
  StepperTitle, 
  StepperTrigger 
} from "@/components/ui/stepper";
import { Users, Building2, Calendar } from 'lucide-react';

const HowItWorksSection = () => {
  // Steps data with titles, descriptions, and icons
  const steps = [
    {
      step: 1,
      icon: <Users className="h-8 w-8 text-[#006ae6]" />,
      title: "Search",
      description: "Use filters to find the exact match you need."
    },
    {
      step: 2,
      icon: <Building2 className="h-8 w-8 text-[#006ae6]" />,
      title: "Connect",
      description: "Click to view a CV or schedule an interview."
    },
    {
      step: 3,
      icon: <Calendar className="h-8 w-8 text-[#006ae6]" />,
      title: "Hire",
      description: "We assist with onboarding, relocation, and integration."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-[30px] font-bold text-black text-center mb-12">
          Partner with <span className="text-gradient">Solvia</span>
        </h2>
        
        <div className="flex flex-col lg:flex-row items-center gap-8 max-w-5xl mx-auto">
          {/* Left section - Visual representation */}
          <div className="lg:w-1/2 relative min-h-[400px] p-8">
            <div className="absolute inset-0 bg-blue-50/50 rounded-xl -z-10"></div>
            <Stepper orientation="vertical" defaultValue={1}>
              {steps.map(({ step, title, description, icon }) => (
                <StepperItem
                  key={step}
                  step={step}
                  className="relative items-start [&:not(:last-child)]:flex-1"
                >
                  <StepperTrigger className="items-start pb-12 last:pb-0 gap-4">
                    <StepperIndicator className="size-12 bg-white shadow-sm data-[state=active]:bg-blue-100 data-[state=completed]:bg-blue-500">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {icon}
                      </div>
                    </StepperIndicator>
                    <div className="mt-0.5 px-2 text-left">
                      <StepperTitle className="text-xl font-semibold mb-1">{title}</StepperTitle>
                      <p className="text-gray-600">{description}</p>
                    </div>
                  </StepperTrigger>
                  {step < steps.length && (
                    <StepperSeparator className="absolute inset-y-0 left-6 top-[calc(3rem+0.125rem)] -order-1 m-0 -translate-x-1/2 group-data-[orientation=vertical]/stepper:h-[calc(100%-3rem-0.25rem)] group-data-[orientation=horizontal]/stepper:w-[calc(100%-3rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none" />
                  )}
                </StepperItem>
              ))}
            </Stepper>
          </div>
          
          {/* Right section - Descriptive content */}
          <div className="lg:w-1/2 space-y-6 py-6">
            <h3 className="text-3xl font-bold text-center lg:text-left">How It Works</h3>
            <p className="text-lg text-gray-600">
              Finding and hiring healthcare professionals has never been easier. Our streamlined process connects you with 
              pre-vetted professionals from around the world, ready to join your institution.
            </p>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h4 className="font-semibold text-lg mb-2">Why partner with us?</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-green-100 p-1 mt-1">
                    <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Access to verified healthcare professionals</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-green-100 p-1 mt-1">
                    <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Support with relocation and documentation</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-green-100 p-1 mt-1">
                    <svg className="h-3 w-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Ongoing integration assistance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
