
import React from 'react';
import { MapPin, GraduationCap, Building, Calendar } from 'lucide-react';

interface VacancyDetailsProps {
  displayLocation: string;
  profession?: string;
  specialty?: string;
  postedDate?: string;
  applicationDeadline?: string;
  description: string;
  requirements: string[];
}

const VacancyDetails: React.FC<VacancyDetailsProps> = ({
  displayLocation,
  profession,
  specialty,
  postedDate,
  description,
  requirements,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{displayLocation}</span>
        </div>
        
        {specialty && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="h-4 w-4" />
            <span>{specialty}</span>
          </div>
        )}
        
        {profession && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building className="h-4 w-4" />
            <span>{profession}</span>
          </div>
        )}
        
        {postedDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Posted: {postedDate}</span>
          </div>
        )}
      </div>

      <div>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </div>

      {requirements.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Requirements:</h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {requirements.slice(0, 3).map((req, index) => (
              <li key={index} className="line-clamp-1">{req}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VacancyDetails;
