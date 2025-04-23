
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useProtectedAction } from '@/hooks/useProtectedAction';

const HeroSection = () => {
  const { handleProtectedAction } = useProtectedAction();

  return (
    <section className="relative py-20 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Find, Connect & Hire Global Healthcare Professionals
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Solvia is your go-to platform for discovering international doctors and nurses prepared for relocation
          </p>
          <Button size="lg" asChild onClick={() => handleProtectedAction(undefined, '/signup/institution')}>
            <Link to="/signup/institution">Browse Talents</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
