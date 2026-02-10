import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const LearningMiniBanner = () => {
  const { t } = useLanguage();
  
  const landing = t?.landing;
  const banner = landing?.learningMiniBanner;
  
  return (
    <section className="py-6 bg-muted/50 border-y border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <span className="text-foreground font-medium">
              {banner?.text || "Medical German Starter Kit — from €29"}
            </span>
          </div>
          <Button asChild variant="link" className="text-primary group p-0">
            <Link to="/learning/starter-kit" className="flex items-center gap-1">
              {banner?.cta || "Get Started"}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LearningMiniBanner;
