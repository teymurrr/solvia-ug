
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FileCheck } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { isSafari, stateToQueryParams } from '@/utils/browserDetection';

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
  const { t } = useLanguage();
  
  // Get translations with fallbacks
  const applyNowText = t?.vacancies?.apply || "Apply Now";
  const appliedText = t?.common?.applied || "Applied";
  
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
      navigate('/signup/professional');
      return;
    }
    
    // Handle different application scenarios
    if (applicationLink) {
      // Open external application link in a new tab
      window.open(applicationLink, '_blank');
    } else {
      // Create state object with all relevant information
      const state = { 
        fromDashboard,
        fromLandingPage,
        searchQuery,
        currentPage,
        selectedFilters
      };
      
      // Handle Safari browser differently
      if (isSafari()) {
        // For Safari, use query params instead of state
        const queryString = stateToQueryParams(state);
        console.log('Safari detected, using query params:', queryString);
        navigate(`/vacancies/${id}/apply${queryString}`);
      } else {
        // For other browsers, use the state object
        console.log('Using state object for navigation:', state);
        navigate(`/vacancies/${id}/apply`, { state });
      }
    }
  };

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
              {appliedText}
            </>
          ) : (
            applyNowText
          )}
        </Button>
      </div>
    );
  }

  // Regular view for all other cards in the site - we're removing the View Details button for the Professional Dashboard
  return (
    <div className="pt-2 flex justify-between gap-2">
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
            {appliedText}
          </>
        ) : (
          applyNowText
        )}
      </Button>
    </div>
  );
};

export default VacancyFooter;
