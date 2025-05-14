
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Professional } from '@/types/landing';
import ProfessionalCardLanding from './ProfessionalCardLanding';
import { useLanguage } from '@/hooks/useLanguage';

interface ProfessionalsSectionProps {
  professionals: Professional[];
}

const ProfessionalsSection: React.FC<ProfessionalsSectionProps> = ({ professionals }) => {
  const { t } = useLanguage();
  
  // Default values in case translations aren't loaded yet
  const title = t?.professionals?.title || "Professionals";
  const subtitle = t?.professionals?.subtitle || "Connect with talented healthcare professionals ready for their next opportunity";
  const viewMore = t?.professionals?.viewMore || "View More";
  
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="space-y-6 mb-8 text-center">
          <h2 className="text-[42px] font-bold text-gray-900 leading-tight">
            {title}
          </h2>
          <p className="text-[20px] text-gray-600">
            {subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {professionals?.slice(0, 4).map((professional) => (
            <ProfessionalCardLanding
              key={professional.id}
              professional={professional}
              className="border-transparent hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            />
          ))}
        </div>
        
        <div className="flex justify-center">
          <Button variant="outline" asChild className="group border-primary text-primary hover:bg-primary/10">
            <Link to="/signup/institution" className="flex items-center">
              {viewMore}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalsSection;
