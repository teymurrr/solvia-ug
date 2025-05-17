
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FileCheck, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  isSafari, 
  stateToQueryParams, 
  createDashboardReturnState, 
  handleDirectApply,
  openInNewTab
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
    isApplied,
    isSafari: isSafari()
  });
  
  // Create state object with all relevant information
  const createNavigationState = () => {
    // This is critical - always set dashboard param to true if we're in dashboard
    // or if isDashboardCard is true
    const dashboardParam = isDashboardCard || fromDashboard ? true : false;
    console.log('[VacancyFooter] Is from dashboard:', dashboardParam);
    
    return { 
      fromDashboard: dashboardParam, 
      fromLandingPage,
      searchQuery,
      currentPage,
      selectedFilters,
      // Add this to ensure we can go back to dashboard directly
      directToDashboard: dashboardParam
    };
  };
  
  const handleAppliedClick = () => {
    toast({
      title: "Already applied",
      description: "You have already applied for this vacancy",
    });
  };
  
  const handleSignupRedirect = () => {
    toast({
      title: "Sign up required",
      description: "Please sign up or log in to apply for this vacancy",
    });
    navigate('/signup/professional');
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    // If already applied, don't do anything
    if (isApplied) {
      e.preventDefault();
      handleAppliedClick();
      return;
    }
    
    // Redirect to signup if user is not logged in
    if (!isLoggedIn && (isLandingPageCard || fromLandingPage)) {
      e.preventDefault();
      handleSignupRedirect();
      return;
    }
    
    const state = createNavigationState();
    const dashboardParam = isDashboardCard || fromDashboard ? true : false;
    
    // Store application state before proceeding
    if (applicationLink) {
      localStorage.setItem('vacancyApplicationState', JSON.stringify({
        fromDashboard: dashboardParam,
        timestamp: Date.now(),
        externalApplication: true
      }));
      
      // For Safari, we'll let the anchor tag handle the navigation
      if (!isSafari() && dashboardParam) {
        // After a short delay, navigate back to dashboard
        setTimeout(() => {
          const returnState = createDashboardReturnState(true, {
            activeTab: 'vacancies',
            externalApplication: true
          });
          
          navigate('/dashboard/professional', { state: returnState });
        }, 100);
      }
    } else {
      // For internal applications, we'll prevent default and handle with navigate
      e.preventDefault();
      navigate(`/vacancies/${id}/apply`, { state });
    }
  };

  // For landing page cards, only show Apply Now button/link
  if (isLandingPageCard) {
    return (
      <div className="pt-2 flex justify-center">
        {isApplied ? (
          <Button 
            disabled
            size={isDashboardCard ? "sm" : "default"}
            variant="outline"
            className="w-full"
          >
            <FileCheck className="mr-2 h-4 w-4" />
            {appliedText}
          </Button>
        ) : (
          applicationLink ? (
            <a 
              href={applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleApplyClick}
              className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2`}
            >
              {applyNowText}
            </a>
          ) : (
            <a
              href={`/vacancies/${id}/apply`}
              onClick={handleApplyClick}
              className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2`}
            >
              {applyNowText}
            </a>
          )
        )}
      </div>
    );
  }

  // Regular view with only Apply Now button/link for all other cards
  return (
    <div className="pt-2 flex justify-between gap-2">
      {isApplied ? (
        <Button 
          disabled
          size={isDashboardCard ? "sm" : "default"}
          variant="outline"
          className="w-full"
        >
          <FileCheck className="mr-2 h-4 w-4" />
          {appliedText}
        </Button>
      ) : (
        applicationLink ? (
          <a 
            href={applicationLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleApplyClick}
            className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full bg-primary text-primary-foreground hover:bg-primary/90 ${isDashboardCard ? 'h-9 rounded-md px-3' : 'h-10 px-4 py-2'}`}
          >
            {applyNowText} <ExternalLink className="h-4 w-4 ml-1" />
          </a>
        ) : (
          <a
            href={`/vacancies/${id}/apply`}
            onClick={handleApplyClick}
            className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full bg-primary text-primary-foreground hover:bg-primary/90 ${isDashboardCard ? 'h-9 rounded-md px-3' : 'h-10 px-4 py-2'}`}
          >
            {applyNowText}
          </a>
        )
      )}
    </div>
  );
};

export default VacancyFooter;
