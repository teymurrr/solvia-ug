import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2 } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const EmployerBanner = () => {
  const { t } = useLanguage();

  return (
    <section className="py-6 bg-primary/5 border-y border-primary/10">
      <div className="container mx-auto px-4">
        <Link 
          to="/employers"
          className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 group"
        >
          <div className="flex items-center gap-2 text-primary">
            <Building2 className="h-5 w-5" />
            <span className="font-medium text-sm md:text-base">
              {t?.employer?.bannerText || "Looking to hire healthcare professionals?"}
            </span>
          </div>
          <span className="flex items-center gap-1 text-primary font-semibold text-sm md:text-base group-hover:underline underline-offset-4">
            {t?.employer?.bannerCta || "Discover our Employer Solutions"}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      </div>
    </section>
  );
};

export default EmployerBanner;
