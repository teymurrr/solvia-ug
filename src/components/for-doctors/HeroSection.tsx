
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="hero-gradient absolute inset-0 opacity-20" />
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold tracking-tight">
            Tu camino para trabajar como médico en Alemania o Austria comienza aquí
          </h1>
          <p className="text-lg md:text-xl lg:text-[22px] text-muted-foreground">
            Solvia es la plataforma digital que simplifica tu proceso: reconocimiento, idioma, trabajo y mudanza—todo en un solo lugar.
          </p>
          <div className="flex justify-center mt-8">
            <Button size="lg" asChild>
              <Link to="/signup">Accede a toda la información gratuita</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
