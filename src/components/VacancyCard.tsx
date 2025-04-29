
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useProtectedAction } from '@/hooks/useProtectedAction';
import { Card, CardContent } from '@/components/ui/card';
import VacancyHeader from './vacancy/VacancyHeader';
import VacancyDetails from './vacancy/VacancyDetails';
import VacancyFooter from './vacancy/VacancyFooter';

interface VacancyCardProps {
  id: string;
  title: string;
  institution: string;
  location?: string;
  jobType: string;
  specialty?: string;
  profession?: string;
  description: string;
  requirements: string[];
  postedDate?: string;
  showSaveOption?: boolean;
  isSaved?: boolean;
  onSaveToggle?: (id: string) => void;
  country?: string;
  city?: string;
  className?: string;
  isDashboardCard?: boolean;
}

const VacancyCard: React.FC<VacancyCardProps> = ({
  id,
  title,
  institution,
  location,
  jobType,
  specialty,
  profession,
  description,
  requirements,
  postedDate,
  showSaveOption = false,
  isSaved = false,
  onSaveToggle,
  country,
  city,
  className,
  isDashboardCard = false,
}) => {
  const { toast } = useToast();
  const { handleProtectedAction } = useProtectedAction();
  
  const displayLocation = location || (city && country ? `${city}, ${country}` : city || country || "Location not specified");
  
  const toggleSave = () => {
    handleProtectedAction(() => {
      if (onSaveToggle) {
        onSaveToggle(id);
        
        toast({
          title: isSaved ? "Vacancy removed from saved" : "Vacancy saved",
          description: isSaved 
            ? "The vacancy has been removed from your saved list" 
            : "The vacancy has been saved for later",
        });
      }
    });
  };

  // Set consistent card styling that matches the landing page design regardless of where it's used
  const cardClasses = `${className || ""} border border-border shadow-sm`;

  return (
    <Card className={cardClasses}>
      <CardContent className="p-6 relative">
        <div className="space-y-4">
          <VacancyHeader
            id={id}
            title={title}
            institution={institution}
            jobType={jobType}
            showSaveOption={showSaveOption}
            isSaved={isSaved}
            onSaveToggle={toggleSave}
          />
          
          <VacancyDetails
            displayLocation={displayLocation}
            profession={profession}
            specialty={specialty}
            postedDate={postedDate}
            description={description}
            requirements={requirements}
          />
        </div>
        
        <div className="mt-6">
          <VacancyFooter id={id} />
        </div>
      </CardContent>
    </Card>
  );
};

export default VacancyCard;
