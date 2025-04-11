
import React from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfessionalCardProps {
  professional: {
    id?: string | number;
    email?: string;
    firstName: string;
    lastName: string;
    specialty?: string;
    isOpenToRelocation?: boolean;
  };
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional }) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
          <User className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-medium">Dr. {professional.firstName} {professional.lastName}</h3>
          <p className="text-sm text-medical-600">{professional.specialty}</p>
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
