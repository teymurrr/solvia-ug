
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Find, Connect & Hire Global Healthcare Professionals
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Solvia is your go-to platform for discovering international doctors and nurses prepared for relocation
          </p>
          <Button size="lg" variant="secondary" asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link to="/signup/institution">Browse Talents</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
