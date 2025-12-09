import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { MapPin, Euro, Lock, Building, UserPlus, FileCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlurredJobCardProps {
  hospital: string;
  specialty: string;
  city: string;
  country: string;
  salaryRange: string;
  isLocked?: boolean;
}

const BlurredJobCard = ({ 
  hospital, 
  specialty, 
  city, 
  country, 
  salaryRange,
  isLocked = true 
}: BlurredJobCardProps) => {
  return (
    <Card className="p-5 border-border/50 hover:shadow-lg transition-all group relative overflow-hidden">
      {/* Visible content */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Building className="h-4 w-4" />
              <span>{hospital}</span>
            </div>
            <h3 className="font-semibold text-lg text-foreground">{specialty}</h3>
          </div>
          {isLocked && (
            <div className="bg-primary/10 p-2 rounded-full">
              <Lock className="h-4 w-4 text-primary" />
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{city}, {country}</span>
        </div>
        
        <div className="flex items-center gap-2 text-primary font-medium">
          <Euro className="h-4 w-4" />
          <span>{salaryRange}</span>
        </div>
        
        {/* Blurred content */}
        <div className="relative mt-4 pt-4 border-t border-border/50">
          <div className="space-y-2 blur-sm select-none pointer-events-none">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Requisitos:</span> B2 alemán, título homologado, experiencia 2+ años
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Beneficios:</span> Contrato indefinido, ayuda con mudanza
            </p>
          </div>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
        </div>

        {/* CTAs - Two action buttons */}
        <div className="flex flex-col gap-2 pt-2">
          {/* Primary CTA - Unlock all offers */}
          <Button asChild size="sm" className="w-full group/btn">
            <Link to="/signup/professional" className="flex items-center justify-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Acceder a todas las ofertas</span>
              <ArrowRight className="h-3 w-3 opacity-0 -ml-2 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all" />
            </Link>
          </Button>
          
          {/* Secondary CTA - Start homologation */}
          <Button asChild variant="outline" size="sm" className="w-full group/btn">
            <Link to="/homologation-wizard" className="flex items-center justify-center gap-2">
              <FileCheck className="h-4 w-4" />
              <span>Homologa tu título gratis</span>
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BlurredJobCard;
