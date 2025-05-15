
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
      // Always set fromDashboard=true if we're in the dashboard to ensure correct back navigation
      const dashboardParam = isDashboardCard || fromDashboard ? true : false;
      
      // Create state object with all relevant information
      const state = { 
        fromDashboard: dashboardParam, // Make sure this is always true when in dashboard
        fromLandingPage,
        searchQuery,
        currentPage,
        selectedFilters
      };
      
      console.log('Applying to vacancy with state:', state);
      console.log('Is in dashboard:', isDashboardCard || fromDashboard);
      
      // Handle Safari browser differently
      if (isSafari()) {
        // For Safari, use query params instead of state
        const queryString = stateToQueryParams(state);
        console.log('Safari detected, using query params for application:', queryString);
        console.log('Navigation target:', `/vacancies/${id}/apply${queryString}`);
        navigate(`/vacancies/${id}/apply${queryString}`);
      } else {
        // For other browsers, use the state object
        console.log('Using state object for application navigation:', state);
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

  // Regular view with only Apply Now button for all other cards
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
