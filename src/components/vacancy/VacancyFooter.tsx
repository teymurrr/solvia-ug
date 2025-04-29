
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface VacancyFooterProps {
  id: string;
  isDashboardCard?: boolean;
}

const VacancyFooter: React.FC<VacancyFooterProps> = ({ id, isDashboardCard = false }) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/signup/professional');
  };

  // Adjust styling based on whether it's a dashboard card
  const buttonClasses = isDashboardCard ? "px-4 py-1 h-9" : "";

  return (
    <div className="pt-2 flex justify-between gap-2">
      <Button 
        variant="outline" 
        onClick={handleRedirect} 
        className={`flex-shrink-0 ${buttonClasses}`}
        size={isDashboardCard ? "sm" : "default"}
      >
        View Details
      </Button>
      <Button 
        onClick={handleRedirect} 
        className={`ml-auto ${buttonClasses}`}
        size={isDashboardCard ? "sm" : "default"}
      >
        Apply Now
      </Button>
    </div>
  );
};

export default VacancyFooter;
