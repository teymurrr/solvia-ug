
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Glow } from "@/components/ui/glow";
import { ArrowRight } from "lucide-react";
import { cn } from '@/lib/utils';

const HeroSection = () => {
  return (
    <section className="relative py-20 overflow-hidden bg-[#1A1F2C] text-white">
      {/* Background glow effect */}
      <Glow variant="bottom" className="opacity-30 bg-primary/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight">
            Find, Connect & Hire Global Healthcare Professionals
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Solvia is your go-to platform for discovering international doctors and nurses prepared for relocation
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
        </div>
      </div>
      
      {/* Gradient overlay at bottom for smooth transition */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-50/50 to-transparent"></div>
    </section>
  );
};

export default HeroSection;
