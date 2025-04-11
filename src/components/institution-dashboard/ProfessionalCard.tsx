
import React from 'react';
import { User, MapPin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfessionalCardProps {
  professional: {
    id?: string | number;
    email?: string;
    firstName: string;
    lastName: string;
    specialty?: string;
    role?: string;
    profession?: string;
    country?: string;
    language?: string;
    isOpenToRelocation?: boolean;
  };
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional }) => {
  console.log('Rendering professional card for:', professional);
  
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
          <User className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-medium">
            {professional.firstName} {professional.lastName}
          </h3>
          {professional.specialty && (
            <p className="text-sm text-medical-600">{professional.specialty}</p>
          )}
          {professional.role && (
            <p className="text-xs text-muted-foreground">{professional.role}</p>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {professional.country && (
              <div className="flex items-center text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                {professional.country}
              </div>
            )}
            {professional.language && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Globe className="h-3 w-3 mr-1" />
                {professional.language}
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {professional.isOpenToRelocation ? "Open to relocation" : "Not open to relocation"}
          </p>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="outline" size="sm">View Profile</Button>
      </div>
    </div>
  );
};

export default ProfessionalCard;
