
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

  // Define card styling based on whether it's a dashboard card
  const cardClasses = isDashboardCard
    ? `border border-border shadow-sm ${className || ""}`
    : `${className || ""} border border-border shadow-sm hover:shadow-lg hover:scale-[1.03] transition-all duration-300`;

  return (
    <Card className={cardClasses}>
      <CardContent className={isDashboardCard ? "p-5" : "p-6"}>
        <div className="space-y-4">
          <VacancyHeader
            id={id}
            title={title}
            institution={institution}
            jobType={jobType}
            showSaveOption={showSaveOption}
            isSaved={isSaved}
            onSaveToggle={toggleSave}
            isDashboardCard={isDashboardCard}
          />
          
          <VacancyDetails
            displayLocation={displayLocation}
            profession={profession}
            specialty={specialty}
            postedDate={postedDate}
            description={description}
            requirements={requirements}
            isDashboardCard={isDashboardCard}
          />
        </div>
        
        <div className="mt-5">
          <VacancyFooter id={id} isDashboardCard={isDashboardCard} />
        </div>
      </CardContent>
    </Card>
  );
};

export default VacancyCard;
