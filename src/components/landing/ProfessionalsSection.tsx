
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Users, ArrowRight } from 'lucide-react';
import { ProfessionalCard } from '@/components/institution-dashboard';
import { Professional } from '@/types/landing';

interface ProfessionalsSectionProps {
  professionals: Professional[];
}

const ProfessionalsSection: React.FC<ProfessionalsSectionProps> = ({ professionals }) => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Users className="h-12 w-12 text-primary mx-auto mb-4" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1" />
            <h2 className="text-3xl font-bold">Professionals</h2>
            <div className="flex-1 flex justify-end">
              <Button variant="ghost" asChild className="group">
                <Link to="/professionals" className="flex items-center">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
          <p className="text-lg text-muted-foreground mb-6">
            Connect with talented healthcare professionals ready for their next opportunity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {professionals.map((professional) => (
            <ProfessionalCard
              key={professional.id}
              professional={professional}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfessionalsSection;
