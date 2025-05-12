
import React from 'react';
import { MapPin, Calendar, Briefcase, Clock } from 'lucide-react';

interface VacancyMetaInfoProps {
  location: string;
  profession: string;
  specialty: string;
  workHours: string;
  applicationDeadline: string;
  daysRemaining: number;
  formatDate: (date: string) => string;
}

const VacancyMetaInfo: React.FC<VacancyMetaInfoProps> = ({
  location,
  profession,
  specialty,
  workHours,
  applicationDeadline,
  daysRemaining,
  formatDate,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 my-6">
      <div className="flex items-center text-muted-foreground">
        <MapPin className="h-4 w-4 mr-2" />
        <span>{location}</span>
      </div>
      
      <div className="flex items-center text-muted-foreground">
        <Briefcase className="h-4 w-4 mr-2" />
        <span>{profession} • {specialty}</span>
      </div>
      
      <div className="flex items-center text-muted-foreground">
        <Clock className="h-4 w-4 mr-2" />
        <span>{workHours}</span>
      </div>
      
      <div className="flex items-center text-muted-foreground">
        <Calendar className="h-4 w-4 mr-2" />
        <span className={daysRemaining < 7 ? 'text-destructive font-medium' : ''}>
          {daysRemaining <= 0 
            ? 'Deadline passed' 
            : `Deadline: ${formatDate(applicationDeadline)} (${daysRemaining} days left)`}
        </span>
      </div>
    </div>
  );
};

export default VacancyMetaInfo;
