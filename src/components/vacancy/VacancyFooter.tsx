
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FileCheck } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  isSafari, 
  stateToQueryParams, 
  createDashboardReturnState, 
  handleDirectApply 
} from '@/utils/browserDetection';

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
  
  // Enhanced logging for debugging
  console.log('[VacancyFooter] Props received:', {
    id,
    isDashboardCard,
    fromDashboard,
    fromLandingPage,
    applicationLink: applicationLink ? 'exists' : 'none',
    isApplied
  });
  
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
    
    // This is critical - always set dashboard param to true if we're in dashboard
    // or if isDashboardCard is true
    const dashboardParam = isDashboardCard || fromDashboard ? true : false;
    console.log('[VacancyFooter] Is from dashboard:', dashboardParam);
    
    // Create state object with all relevant information
    const state = { 
      fromDashboard: dashboardParam, 
      fromLandingPage,
      searchQuery,
      currentPage,
      selectedFilters,
      // Add this to ensure we can go back to dashboard directly
      directToDashboard: dashboardParam
    };
    
    // SAFARI SPECIFIC HANDLING - Direct navigation for Safari
    // This will skip the vacancy details page and go straight to application for Safari
    //const didHandleSafari = handleDirectApply(id, applicationLink, state, navigate);
    //if (didHandleSafari) {
      //console.log('[VacancyFooter] Safari handled with direct navigation');
      //return;
    //}
    
    // STANDARD FLOW FOR OTHER BROWSERS
    // Handle different application scenarios
    if (applicationLink) {
      // For external applications, directly open link in new tab
      console.log('[VacancyFooter] Opening external application link:', applicationLink);
      window.open(applicationLink, '_blank');
      
      // Now immediately navigate back to dashboard if we came from there
      if (dashboardParam) {
        const state = createDashboardReturnState(true, {
          activeTab: 'vacancies',
          externalApplication: true
        });
        
        console.log('[VacancyFooter] Redirecting back to dashboard after external link');
        navigate('/dashboard/professional', { state });
      }
    } else {
      // For internal applications, navigate to application page
      console.log('[VacancyFooter] Navigating to application page with state:', state);
      navigate(`/vacancies/${id}/apply`, { state });
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
