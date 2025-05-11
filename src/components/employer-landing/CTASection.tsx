
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary via-primary/95 to-primary text-white">
      <div className="container mx-auto px-4 text-center text-white">
        <h2 className="text-3xl font-bold mb-6 text-white">Still hiring the old way?</h2>
        <p className="text-xl mb-8 text-white">Let Solvia AI do the heavy lifting.<br />We bring talent. You focus on care.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild>
            <Link to="/signup">Free Sign Up</Link>
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent border-white hover:bg-white/10 text-white" asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
