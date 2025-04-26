
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
  applicationDeadline,
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
    <Card className="overflow-hidden hover:shadow-xl transition-shadow shadow-md border-transparent hover:scale-[1.02]">
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
      
      <CardContent>
        <VacancyDetails
          displayLocation={displayLocation}
          profession={profession}
          specialty={specialty}
          postedDate={postedDate}
          applicationDeadline={applicationDeadline}
          description={description}
          requirements={requirements}
        />
      </CardContent>
      
      <CardFooter>
        <VacancyFooter id={id} />
      </CardFooter>
    </Card>
  );
};

export default VacancyCard;
