import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useProtectedAction } from '@/hooks/useProtectedAction';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
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
  applicationDeadline?: string;
  showSaveOption?: boolean;
  isSaved?: boolean;
  onSaveToggle?: (id: string) => void;
  country?: string;
  city?: string;
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

  return (
    <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:scale-[1.03] shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.12)] border-transparent">
      <CardHeader className="pb-3">
        <VacancyHeader
          id={id}
          title={title}
          institution={institution}
          jobType={jobType}
          showSaveOption={showSaveOption}
          isSaved={isSaved}
          onSaveToggle={toggleSave}
        />
      </CardHeader>
      
      <CardContent className="pb-16 relative">
        <VacancyDetails
          displayLocation={displayLocation}
          profession={profession}
          specialty={specialty}
          postedDate={postedDate}
          description={description}
          requirements={requirements}
        />
        <div className="absolute bottom-6 left-6 right-6">
          <VacancyFooter id={id} />
        </div>
      </CardContent>
    </Card>
  );
};

export default VacancyCard;
