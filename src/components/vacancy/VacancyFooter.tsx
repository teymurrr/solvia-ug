
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FileCheck, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { isSafari } from '@/utils/browserDetection';
import ApplyDialog from './ApplyDialog';

interface VacancyFooterProps {
  id: string;
  title?: string;
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
  onApplied?: () => void;
}

const VacancyFooter: React.FC<VacancyFooterProps> = ({ 
  id, 
  title = '',
  isDashboardCard = false, 
  applicationLink,
  fromDashboard = false,
  fromLandingPage = false,
  isLandingPageCard = false,
  isLoggedIn = false,
  isApplied = false,
  onApplied
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [localApplied, setLocalApplied] = useState(false);
  
  const applyNowText = t?.vacancies?.apply || "Apply Now";
  const appliedText = t?.common?.applied || "Applied";
  
  const applied = isApplied || localApplied;

  const handleAppliedClick = () => {
    toast({
      title: t?.vacancies?.applyDialog?.alreadyApplied || "Already applied",
      description: t?.vacancies?.applyDialog?.alreadyAppliedDesc || "You have already expressed interest in this position.",
    });
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (applied) {
      handleAppliedClick();
      return;
    }
    
    if (!isLoggedIn) {
      toast({
        title: "Sign up required",
        description: "Please sign up or log in to apply for this vacancy",
      });
      navigate('/signup/professional');
      return;
    }
    
    // If there's an external application link, open it
    if (applicationLink) {
      window.open(applicationLink, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // Open the interest dialog
    setDialogOpen(true);
  };

  const handleApplicationSuccess = () => {
    setLocalApplied(true);
    onApplied?.();
  };

  const renderButton = () => {
    if (applied) {
      return (
        <Button 
          disabled
          size={isDashboardCard ? "sm" : "default"}
          variant="outline"
          className="w-full"
        >
          <FileCheck className="mr-2 h-4 w-4" />
          {appliedText}
        </Button>
      );
    }

    return (
      <Button
        size={isDashboardCard ? "sm" : "default"}
        className="w-full"
        onClick={handleApplyClick}
      >
        {applyNowText}
        {applicationLink && <ExternalLink className="h-4 w-4 ml-1" />}
      </Button>
    );
  };

  return (
    <>
      <div className={`pt-2 ${isLandingPageCard ? 'flex justify-center' : 'flex justify-between gap-2'}`}>
        {renderButton()}
      </div>
      <ApplyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vacancyId={id}
        vacancyTitle={title}
        onSuccess={handleApplicationSuccess}
      />
    </>
  );
};

export default VacancyFooter;
