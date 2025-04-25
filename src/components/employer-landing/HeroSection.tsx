
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative py-20 bg-[hsl(var(--dark-navy))] text-white overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="employer-hero-gradient absolute inset-0 opacity-70" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight">
            Find, Connect & Hire Global Healthcare Professionals
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Solvia is your go-to platform for discovering international doctors and nurses prepared for relocation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[hsl(var(--dark-navy))] hover:bg-gray-100" asChild>
              <Link to="/signup/institution">Browse Talents</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
