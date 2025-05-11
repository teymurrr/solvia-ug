
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FileCheck } from 'lucide-react';

interface VacancyFooterProps {
  id: string;
  isDashboardCard?: boolean;
  applicationLink?: string;
  fromDashboard?: boolean;
  fromLandingPage?: boolean;
  searchQuery?: string;
  currentPage?: number;
  selectedFilters?: any;
  isLandingPageCard?: boolean;
  isLoggedIn?: boolean;
  isApplied?: boolean;
}

const VacancyFooter: React.FC<VacancyFooterProps> = ({ 
  id, 
  isDashboardCard = false, 
  applicationLink,
  fromDashboard = false,
  fromLandingPage = false,
  searchQuery,
  currentPage,
  selectedFilters,
  isLandingPageCard = false,
  isLoggedIn = false,
  isApplied = false
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleApply = () => {
    // If already applied, don't do anything
    if (isApplied) {
      toast({
        title: "Already applied",
        description: "You have already applied for this vacancy",
      });
      return;
    }
    
    // Redirect to signup if user is not logged in
    if (!isLoggedIn && (isLandingPageCard || fromLandingPage)) {
      toast({
        title: "Sign up required",
        description: "Please sign up or log in to apply for this vacancy",
      });
      navigate('/signup');
      return;
    }
    
    // Handle different application scenarios
    if (applicationLink) {
      // Open external application link in a new tab
      window.open(applicationLink, '_blank');
    } else {
      // Navigate to internal application page with state to track origin
      navigate(`/vacancies/${id}/apply`, {
        state: { 
          fromDashboard,
          fromLandingPage,
          searchQuery,
          currentPage,
          selectedFilters
        }
      });
    }
  };

  const handleViewDetails = () => {
    // Redirect to signup if user is not logged in
    if (!isLoggedIn && (isLandingPageCard || fromLandingPage)) {
      toast({
        title: "Sign up required",
        description: "Please sign up or log in to view vacancy details",
      });
      navigate('/signup');
      return;
    }
    
    navigate(`/vacancies/${id}`, {
      state: { 
        fromDashboard,
        fromLandingPage,
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
          variant={isApplied ? "outline" : "default"}
          disabled={isApplied}
        >
          {isApplied ? (
            <>
              <FileCheck className="mr-2 h-4 w-4" />
              Applied
            </>
          ) : (
            "Apply Now"
          )}
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
        variant={isApplied ? "outline" : "default"}
        disabled={isApplied}
      >
        {isApplied ? (
          <>
            <FileCheck className="mr-2 h-4 w-4" />
            Applied
          </>
        ) : (
          "Apply Now"
        )}
      </Button>
    </div>
  );
};

export default VacancyFooter;
