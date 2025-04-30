
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  applicationLink?: string;
  searchQuery?: string;
  currentPage?: number;
  selectedFilters?: any;
  isLandingPageCard?: boolean;
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
  applicationLink,
  searchQuery,
  currentPage,
  selectedFilters,
  isLandingPageCard = false,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { handleProtectedAction } = useProtectedAction();
  
  const displayLocation = location || (city && country ? `${city}, ${country}` : city || country || "Location not specified");
  
  const toggleSave = (e: React.MouseEvent) => {
    // Stop propagation to prevent navigation when clicking save button
    e.stopPropagation();
    
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

  const handleCardClick = () => {
    // Pass source information to know where to navigate back to
    navigate(`/vacancies/${id}`, {
      state: { 
        fromDashboard: isDashboardCard,
        fromLandingPage: isLandingPageCard,
        searchQuery,
        currentPage,
        selectedFilters
      }
    });
  };

  // Define card styling based on whether it's a dashboard card or landing page card
  const cardClasses = isDashboardCard
    ? `border border-border shadow-sm ${className || ""} cursor-pointer`
    : isLandingPageCard 
      ? `${className || ""} border border-border shadow-sm hover:shadow-lg hover:scale-[1.03] transition-all duration-500 ease-in-out cursor-pointer`
      : `${className || ""} border border-border shadow-sm hover:shadow-lg hover:scale-[1.03] transition-all duration-300 cursor-pointer`;

  return (
    <Card className={cardClasses} onClick={handleCardClick}>
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
        
        <div className="mt-5" onClick={(e) => e.stopPropagation()}>
          <VacancyFooter 
            id={id} 
            isDashboardCard={isDashboardCard} 
            applicationLink={applicationLink}
            fromDashboard={isDashboardCard}
            fromLandingPage={isLandingPageCard}
            searchQuery={searchQuery}
            currentPage={currentPage}
            selectedFilters={selectedFilters}
            isLandingPageCard={isLandingPageCard}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default VacancyCard;
