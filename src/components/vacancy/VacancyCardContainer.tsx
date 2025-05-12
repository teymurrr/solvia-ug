import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import VacancyHeader from './VacancyHeader';
import VacancyContent from './VacancyContent';
import VacancyFooter from './VacancyFooter';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { VacancyCardProps } from './types';

const VacancyCardContainer: React.FC<VacancyCardProps> = ({
  id,
  title,
  institution,
  location,
  jobType,
  specialty,
  profession,
  department,
  salary,
  createdAt,
  applicationCount,
  isDashboardCard = false,
  isSaved = false,
  isApplied = false,
  className,
  showSaveOption = true,
  onSaveToggle,
  isLandingPageCard = false,
  fromLandingPage = false,
  showDescription = false,
  showRequirements = false,
  description,
  requirements,
  searchQuery,
  currentPage,
  selectedFilters,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();

  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSaveToggle) {
      onSaveToggle(id);
    }
  };

  const handleCardClick = () => {
    // Redirect to signup if this card is from landing page
    if (isLandingPageCard || fromLandingPage) {
      toast({
        title: "Sign up required",
        description: "Please sign up or log in to view vacancy details",
      });
      navigate('/signup/professional');
      return;
    }
    
    // Otherwise navigate to vacancy details
    navigate(`/vacancies/${id}`);
  };

  return (
    <Card className={cn("h-full border hover:shadow-md transition-shadow cursor-pointer", className)} onClick={handleCardClick}>
      <CardContent className="p-0">
        <div className="p-5">
          <VacancyHeader
            id={id}
            title={title}
            institution={institution}
            location={location}
            showSaveOption={showSaveOption}
            isSaved={isSaved}
            onSaveToggle={handleSaveClick}
          />
          
          <VacancyContent
            specialty={specialty}
            jobType={jobType}
            salary={salary}
            profession={profession}
            isApplied={isApplied}
            description={description}
            requirements={requirements}
            createdAt={createdAt}
            applicationCount={applicationCount}
            isDashboardCard={isDashboardCard}
            showDescription={showDescription}
            showRequirements={showRequirements}
          />
        </div>

        {/* Apply button at the bottom of card */}
        {(isLandingPageCard || fromLandingPage) && (
          <div className="px-5 pb-5 pt-2" onClick={e => e.stopPropagation()}>
            <VacancyFooter 
              id={id}
              isLandingPageCard={true}
              fromLandingPage={true}
              isLoggedIn={!!session}
              isApplied={isApplied}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VacancyCardContainer;
