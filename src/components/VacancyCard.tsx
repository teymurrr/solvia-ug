
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useProtectedAction } from '@/hooks/useProtectedAction';
import { Card, CardContent } from '@/components/ui/card';
import VacancyHeader from './vacancy/VacancyHeader';
import VacancyDetails from './vacancy/VacancyDetails';
import VacancyFooter from './vacancy/VacancyFooter';
import { useAuth } from '@/contexts/AuthContext';

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
  isApplied?: boolean;
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
  fromLandingPage?: boolean;
  application_link?: string;
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
  isApplied = false,
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
  fromLandingPage = false,
  application_link,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { handleProtectedAction } = useProtectedAction();
  const { isLoggedIn } = useAuth();
  
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
    // For landing page cards, redirect to signup if not logged in
    if ((isLandingPageCard || fromLandingPage) && !isLoggedIn) {
      toast({
        title: "Sign up required",
        description: "Please sign up or log in to view vacancy details",
      });
      navigate('/signup');
      return;
    }
    
    // Otherwise proceed with normal navigation
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
            isApplied={isApplied}
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
            applicationLink={applicationLink || application_link}
            fromDashboard={isDashboardCard}
            fromLandingPage={isLandingPageCard}
            searchQuery={searchQuery}
            currentPage={currentPage}
            selectedFilters={selectedFilters}
            isLandingPageCard={isLandingPageCard}
            isLoggedIn={isLoggedIn}
            isApplied={isApplied}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default VacancyCard;
