
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6 text-white">Still hiring the old way?</h2>
        <p className="text-xl mb-8 text-gray-300">Let Solvia AI do the heavy lifting.<br />We bring talent. You focus on care.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
            <Link to="/signup/institution">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white hover:bg-white/10 text-white" asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
