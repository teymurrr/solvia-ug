import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const SuperCTASection = () => {
  const { t } = useLanguage();
  
  const landing = t?.landing;
  const superCta = landing?.superCta;
  
  return (
    <section className="py-20 hero-gradient text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-8 backdrop-blur-sm">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium">Start Today</span>
          </div>
          
          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {superCta?.title || "Start Your Journey to Europe Today"}
          </h2>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed">
            {superCta?.subtitle || "Thousands of doctors and nurses have already started their process with Solvia"}
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              variant="secondary"
              className="group text-base px-8 py-6"
            >
              <Link to="/homologation-wizard" className="flex items-center gap-2">
                {superCta?.primaryCta || "Start my free assessment"}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              size="lg" 
              variant="outline"
              className="group text-base px-8 py-6 bg-transparent text-white border-white hover:bg-white/10"
            >
              <Link to="/vacancies" className="flex items-center gap-2">
                {superCta?.secondaryCta || "Explore open positions"}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuperCTASection;
