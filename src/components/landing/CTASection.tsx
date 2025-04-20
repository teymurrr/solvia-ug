
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="hero-gradient text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Healthcare Recruitment?</h2>
          <p className="text-lg mb-8">
            Join thousands of healthcare professionals and institutions already using MedConnect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/signup">Create Your Account</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" asChild>
              <Link to="/contact">Talk to Our Team</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
