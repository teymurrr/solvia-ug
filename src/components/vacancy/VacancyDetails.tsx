
import React from 'react';
import { MapPin, Briefcase, Calendar, Medal } from 'lucide-react';
import { formatDate, calculateDaysRemaining } from './utils';

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
  applicationDeadline,
  description,
  requirements,
}) => {
  const daysRemaining = calculateDaysRemaining(applicationDeadline);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 mb-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{displayLocation}</span>
        </div>
        {(profession || specialty) && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Briefcase className="h-4 w-4 mr-2" />
            <span>{profession} {specialty ? `• ${specialty}` : ''}</span>
          </div>
        )}
        {postedDate && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Posted: {formatDate(postedDate)}</span>
          </div>
        )}
        {applicationDeadline && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span className={daysRemaining !== null && daysRemaining < 7 ? 'text-destructive font-medium' : ''}>
              {daysRemaining !== null ? (
                daysRemaining <= 0 
                  ? 'Deadline passed' 
                  : `Deadline: ${formatDate(applicationDeadline)} (${daysRemaining} days left)`
              ) : (
                `Deadline: ${formatDate(applicationDeadline)}`
              )}
            </span>
          </div>
        )}
      </div>

      <p className="text-sm mb-4 line-clamp-3">{description}</p>

      <div className="space-y-2">
        <div className="flex items-start">
          <Medal className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
          <div>
            <h4 className="text-sm font-medium">Requirements:</h4>
            <ul className="text-sm text-muted-foreground ml-5 list-disc">
              {requirements.slice(0, 3).map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
              {requirements.length > 3 && (
                <li>+{requirements.length - 3} more</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default VacancyDetails;
