
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useVacancies } from "@/hooks/useVacancies";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/hooks/useLanguage';

interface VacancyFooterProps {
  id: string;
  applyUrl?: string;
  similarVacancies?: any[];
  // Adding these properties to support VacancyCard usage
  isLandingPageCard?: boolean;
  fromLandingPage?: boolean;
  isLoggedIn?: boolean;
  isApplied?: boolean;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

const VacancyFooter = ({ 
  id, 
  applyUrl, 
  similarVacancies = [],
  isLandingPageCard = false,
  fromLandingPage = false,
  isLoggedIn: isLoggedInProp,
  isApplied = false
}: VacancyFooterProps) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const { vacancies, handleAddVacancy, handleUpdateVacancy, handleDeleteVacancy, loading, submitting, error, refreshVacancies } = useVacancies();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Use the prop if provided, otherwise use the context value
  const effectiveIsLoggedIn = isLoggedInProp !== undefined ? isLoggedInProp : isLoggedIn;
  
  const handleApply = () => {
    if (!effectiveIsLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign up or log in to apply for this vacancy.",
        variant: "destructive",
      });
      return;
    }

    if (applyUrl) {
      window.open(applyUrl, '_blank');
    } else {
      toast({
        title: "Application Unavailable",
        description: "The application link is not available for this vacancy.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (id: string) => {
    if (!effectiveIsLoggedIn) {
       toast({
        title: "Authentication Required",
        description: "Please sign up or log in to save this vacancy.",
        variant: "destructive",
      });
      return;
    }

    const isSaved = location.pathname.includes('/dashboard');

    try {
      await handleUpdateVacancy({ id, saved: !isSaved });

      toast({
        title: isSaved ? "Vacancy removed" : "Vacancy saved",
        description: isSaved
          ? "The vacancy has been removed from your saved vacancies."
          : "The vacancy has been saved to your profile.",
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "There was an error saving the vacancy. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <Button variant="outline" size="sm" className="flex items-center gap-1" asChild>
          <Link to="/vacancies">
            <ChevronLeft className="h-4 w-4" />
            {t?.vacancies?.viewAll || "View All Vacancies"}
          </Link>
        </Button>
        
        <div className="flex gap-2 mt-4 sm:mt-0">
          {applyUrl && (
            <Button onClick={handleApply}>
              {t?.vacancies?.apply || "Apply Now"}
            </Button>
          )}
          {!location.pathname.includes('/dashboard') && (
            <Button variant="secondary" onClick={() => handleSave(id)}>
              {t?.vacancies?.save || "Save"}
            </Button>
          )}
          {location.pathname.includes('/dashboard') && (
            <Button variant="destructive" onClick={() => handleSave(id)}>
              {t?.vacancies?.save || "Remove"}
            </Button>
          )}
        </div>
      </div>
      
      {similarVacancies.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Similar Positions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {similarVacancies.map((vacancy) => (
              <div key={vacancy.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-primary">{vacancy.title}</h4>
                <p className="text-sm text-gray-500">{vacancy.institution_name}</p>
                <Button size="sm" className="mt-3" variant="outline" asChild>
                  <Link to={`/vacancies/${vacancy.id}`}>
                    {t?.vacancies?.viewMore || "View More"}
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VacancyFooter;
