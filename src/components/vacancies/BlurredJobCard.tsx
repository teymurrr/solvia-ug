import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { MapPin, Euro, Lock, Building, UserPlus, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

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
  const { t } = useLanguage();
  
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
              <span className="font-medium">{t?.vacancies?.blurredCard?.requirements || 'Requirements'}:</span> B2 {t?.common?.german || 'German'}, {t?.vacancies?.blurredCard?.homologatedTitle || 'homologated title'}, 2+ {t?.common?.yearsExperience || 'years experience'}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">{t?.vacancies?.blurredCard?.benefits || 'Benefits'}:</span> {t?.vacancies?.blurredCard?.permanentContract || 'Permanent contract'}, {t?.vacancies?.blurredCard?.relocationHelp || 'relocation assistance'}
            </p>
          </div>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
        </div>

        {/* CTAs - Two action buttons side by side */}
        <div className="flex gap-2 pt-2">
          {/* Primary CTA - Unlock all offers */}
          <Button asChild size="sm" className="flex-1 group/btn text-xs px-2">
            <Link to="/signup/professional" className="flex items-center justify-center gap-1">
              <UserPlus className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{t?.vacancies?.blurredCard?.viewOffers || 'Apply'}</span>
            </Link>
          </Button>
          
          {/* Secondary CTA - Start homologation for this opportunity */}
          <Button asChild variant="outline" size="sm" className="flex-1 group/btn text-xs px-2">
            <Link to="/homologation-wizard" className="flex items-center justify-center gap-1">
              <FileCheck className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{t?.vacancies?.blurredCard?.homologateTitle || 'Homologate degree'}</span>
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BlurredJobCard;
