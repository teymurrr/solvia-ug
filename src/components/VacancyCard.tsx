
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Building2, MapPin } from 'lucide-react'; 
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import VacancyHeader from './vacancy/VacancyHeader';
import VacancyFooter from './vacancy/VacancyFooter';
import VacancyDetails from './vacancy/VacancyDetails';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';

const getRandomDaysAgo = () => {
  const days = [2, 3, 4, 5, 6, 7, 10];
  return days[Math.floor(Math.random() * days.length)];
};

export interface VacancyCardProps {
  id: string;
  title: string;
  institution: string;
  location: string;
  jobType: string;
  specialty?: string;
  profession?: string;
  department?: string;
  salary?: string;
  benefits?: string[];
  createdAt?: string;
  expiresAt?: string;
  applicationCount?: number;
  description?: string;
  requirements?: string[];
  status?: 'active' | 'draft' | 'expired' | 'closed';
  isDashboardCard?: boolean;
  isSaved?: boolean;
  isApplied?: boolean;
  className?: string;
  showSaveOption?: boolean;
  onSaveToggle?: (id: string) => void;
  isLandingPageCard?: boolean;
  fromLandingPage?: boolean;
  fromDashboard?: boolean;
  showDescription?: boolean;
  showRequirements?: boolean;
  searchQuery?: string;
  currentPage?: number;
  selectedFilters?: {
    jobTypes: string[];
    country: string;
    city: string;
  };
}

const VacancyCard: React.FC<VacancyCardProps> = ({
  id,
  title,
  institution,
  location,
  jobType,
  specialty,
  profession,
  department,
  salary,
  benefits,
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
  fromDashboard = false,
  showDescription = true, // Make description visible by default
  showRequirements = true, // Make requirements visible by default
  description,
  requirements,
  searchQuery,
  currentPage,
  selectedFilters,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const daysAgo = getRandomDaysAgo();
  
  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSaveToggle) {
      onSaveToggle(id);
    }
  };

  // Removed handleCardClick since cards are no longer clickable

  return (
    <Card className={cn("h-full border hover:border-gray-300 transition-shadow", className)}>
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <Building2 className="mr-1 h-4 w-4" />
                <span>{institution}</span>
              </div>
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <MapPin className="mr-1 h-4 w-4" />
                <span>{location}</span>
              </div>
            </div>
            
            {showSaveOption && (
              <Button
                variant="ghost"
                size="icon"
                aria-label={isSaved ? "Remove from saved" : "Save vacancy"}
                className="h-8 w-8"
                onClick={handleSaveClick}
              >
                {isSaved ? (
                  <BookmarkCheck className="h-5 w-5 text-primary" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline" className="bg-gray-50">
              {specialty}
            </Badge>
            <Badge variant="outline" className="bg-gray-50">
              {t?.vacancies?.jobTypes?.[jobType?.toLowerCase()?.replace(/[-\s]/g, '')] || jobType}
            </Badge>
            {salary && (
              <Badge variant="outline" className="bg-gray-50">
                {salary}
              </Badge>
            )}
            {profession && (
              <Badge variant="outline" className="bg-gray-50">
                {profession}
              </Badge>
            )}
            {isApplied && (
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                {t?.common?.applied || "Applied"}
              </Badge>
            )}
          </div>

          {/* Display description only if showDescription is true */}
          {showDescription && description && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-1">{t?.vacancies?.description || "Description"}</h4>
              <p className="text-sm text-gray-600 line-clamp-4">{description}</p>
            </div>
          )}

          {/* Display requirements only if showRequirements is true */}
          {showRequirements && requirements && requirements.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-1">{t?.vacancies?.keyRequirements || "Key Requirements"}</h4>
              <ul className="text-sm text-gray-600 pl-5">
                {requirements.map((requirement, index) => (
                  <li key={index} className="list-disc">
                    <span className="line-clamp-1">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {createdAt && !isDashboardCard && (
            <div className="mt-4 flex items-center text-xs text-gray-500">
              <span>{t?.vacancies?.publishedDaysAgo?.replace('{days}', daysAgo.toString()) || `Published ${daysAgo} days ago`}</span>
            </div>
          )}

          {isDashboardCard && applicationCount !== undefined && (
            <div className="mt-4 text-sm text-gray-600">
              {applicationCount} {applicationCount === 1 
                ? (t?.vacancies?.application || "application") 
                : (t?.vacancies?.applications || "applications")}
            </div>
          )}
        </div>

        {/* Always add apply button at the bottom of card */}
        <div className="px-5 pb-5 pt-2">
          <VacancyFooter 
            id={id}
            isLandingPageCard={isLandingPageCard}
            fromLandingPage={fromLandingPage}
            isLoggedIn={true}
            isApplied={isApplied}
            searchQuery={searchQuery}
            currentPage={currentPage}
            selectedFilters={selectedFilters}
            fromDashboard={fromDashboard}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default VacancyCard;
