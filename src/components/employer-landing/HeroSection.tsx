
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative py-20 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold mb-8 tracking-tight leading-tight">
            Find, Connect & Hire Global Healthcare Professionals
          </h1>
          <p className="text-lg md:text-xl lg:text-[22px] text-gray-600 mb-10 max-w-2xl mx-auto">
            Solvia is your go-to platform for discovering international doctors and nurses prepared for relocation
          </p>
          <Button size="lg" asChild>
            <Link to="/signup/institution">Browse Talents</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
