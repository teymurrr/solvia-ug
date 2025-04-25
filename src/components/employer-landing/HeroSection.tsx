
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Mockup, MockupFrame } from "@/components/ui/mockup";
import { Glow } from "@/components/ui/glow";
import { cn } from '@/lib/utils';

const HeroSection = () => {
  return (
    <section className={cn(
      "relative overflow-hidden bg-[#1A1F2C] text-white",
      "py-12 sm:py-24 md:py-32 px-4",
      "fade-bottom pb-0"
    )}>
      {/* Background glow effect */}
      <Glow variant="bottom" className="opacity-30 bg-primary/10" />
      
      <div className="mx-auto flex max-w-container flex-col gap-12 pt-16 sm:gap-24">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
          {/* Badge */}
          <Badge variant="comingSoon" className="animate-appear gap-2">
            <span>New Healthcare Opportunities</span>
            <Link to="/insights" className="flex items-center gap-1">
              Learn More
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Badge>

          {/* Title */}
          <h1 className="relative z-10 inline-block animate-appear bg-gradient-to-r from-white to-gray-300 bg-clip-text text-4xl font-semibold leading-tight text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-7xl md:leading-tight">
            Find, Connect & Hire Global Healthcare Professionals
          </h1>

          {/* Description */}
          <p className="text-md relative z-10 max-w-[550px] animate-appear font-medium text-gray-300 opacity-0 delay-100 sm:text-xl">
            Solvia is your go-to platform for discovering international doctors and nurses prepared for relocation
          </p>

          {/* Actions */}
          <div className="relative z-10 flex animate-appear justify-center gap-4 opacity-0 delay-300">
            <Button 
              size="lg" 
              className="bg-white text-[#1A1F2C] hover:bg-white/90 transition-all"
              asChild
            >
              <Link to="/signup/institution" className="flex items-center gap-2">
                Browse Talents
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
              asChild
            >
              <Link to="/about">Learn More</Link>
            </Button>
          </div>

          {/* Image with Glow */}
          <div className="relative pt-12">
            <MockupFrame
              className="animate-appear opacity-0 delay-700"
              size="small"
            >
              <Mockup type="responsive">
                <img
                  src="/lovable-uploads/50866c4f-dae7-4f12-82b4-78f2002e281a.png"
                  alt="Healthcare dashboard"
                  className="w-full h-auto"
                />
              </Mockup>
            </MockupFrame>
            <Glow
              variant="top"
              className="animate-appear-zoom opacity-0 delay-1000"
            />
          </div>
        </div>
      </div>
      
      {/* Gradient overlay at bottom for smooth transition */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-50/50 to-transparent"></div>
    </section>
  );
};

export default HeroSection;
