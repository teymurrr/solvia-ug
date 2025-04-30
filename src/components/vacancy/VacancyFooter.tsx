
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface VacancyFooterProps {
  id: string;
  isDashboardCard?: boolean;
  applicationLink?: string;
  fromDashboard?: boolean;
  searchQuery?: string;
  currentPage?: number;
  selectedFilters?: any;
  isLandingPageCard?: boolean;
}

const VacancyFooter: React.FC<VacancyFooterProps> = ({ 
  id, 
  isDashboardCard = false, 
  applicationLink,
  fromDashboard = false,
  searchQuery,
  currentPage,
  selectedFilters,
  isLandingPageCard = false
}) => {
  const navigate = useNavigate();

  const handleApply = () => {
    // Handle different application scenarios
    if (applicationLink) {
      // Open external application link in a new tab
      window.open(applicationLink, '_blank');
    } else {
      // Navigate to internal application page with state to track origin
      navigate(`/vacancies/${id}/apply`, {
        state: { 
          fromDashboard,
          searchQuery,
          currentPage,
          selectedFilters
        }
      });
    }
  };

  const handleViewDetails = () => {
    navigate(`/vacancies/${id}`, {
      state: { 
        fromDashboard,
        searchQuery,
        currentPage,
        selectedFilters
      }
    });
  };

  // Adjust styling based on whether it's a dashboard card
  const buttonClasses = isDashboardCard ? "px-4 py-1 h-9" : "";

  // For landing page cards, only show Apply Now button
  if (isLandingPageCard) {
    return (
      <div className="pt-2 flex justify-center">
        <Button 
          onClick={handleApply} 
          className="w-full"
          size={isDashboardCard ? "sm" : "default"}
        >
          Apply Now
        </Button>
      </div>
    );
  }

  // Regular view for all other cards in the site
  return (
    <div className="pt-2 flex justify-between gap-2">
      {/* Only show View Details button if not in dashboard */}
      {!isDashboardCard && (
        <Button 
          variant="outline" 
          onClick={handleViewDetails} 
          className={`flex-shrink-0 ${buttonClasses}`}
          size={isDashboardCard ? "sm" : "default"}
        >
          View Details
        </Button>
      )}
      <Button 
        onClick={handleApply} 
        className={`${!isDashboardCard ? 'ml-auto' : 'w-full'} ${buttonClasses}`}
        size={isDashboardCard ? "sm" : "default"}
      >
        Apply Now
      </Button>
    </div>
  );
};

export default VacancyFooter;
