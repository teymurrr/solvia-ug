
import React from 'react';
import { MapPin } from 'lucide-react';

interface VacancyDetailsProps {
  displayLocation: string;
  profession?: string;
  specialty?: string;
  postedDate?: string;
  description: string;
  requirements: string[] | null;
  isDashboardCard?: boolean;
}

const VacancyDetails: React.FC<VacancyDetailsProps> = ({
  displayLocation,
  profession,
  specialty,
  postedDate,
  description,
  requirements = [], // Provide default empty array
  isDashboardCard = false
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center text-muted-foreground">
        <MapPin className="h-4 w-4 mr-1" />
        <span className="text-sm">{displayLocation}</span>
      </div>
      
      {(profession || specialty) && (
        <div className="space-x-2">
          {profession && (
            <span className="inline-flex text-xs bg-primary/10 text-primary rounded-full px-2 py-1">
              {profession}
            </span>
          )}
          {specialty && (
            <span className="inline-flex text-xs bg-primary/10 text-primary rounded-full px-2 py-1">
              {specialty}
            </span>
          )}
        </div>
      )}
      
      {postedDate && (
        <div className="text-sm text-muted-foreground">
          Posted: {new Date(postedDate).toLocaleDateString()}
        </div>
      )}
      
      {/* Show full description for dashboard cards */}
      <p className="text-sm text-muted-foreground">
        {description}
      </p>
      
      {requirements && requirements.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-1">Requirements:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {/* Show all requirements in dashboard mode */}
            {requirements.map((requirement, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VacancyDetails;
