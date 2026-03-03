import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bookmark, BookmarkCheck, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { Building2, MapPin } from 'lucide-react'; 
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import VacancyHeader from './vacancy/VacancyHeader';
import VacancyFooter from './vacancy/VacancyFooter';
import VacancyDetails from './vacancy/VacancyDetails';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Analytics from '@/utils/analyticsTracking';
import { getLocalizedVacancyField } from '@/utils/getLocalizedVacancyField';
import type { Language } from '@/utils/i18n/translations';
import { getLocalizedJobType, getLocalizedProfession, localizeSalary } from '@/utils/jobTranslations';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const getRandomDaysAgo = () => {
  const days = [2, 3, 4, 5, 6, 7, 10];
  return days[Math.floor(Math.random() * days.length)];
};

export interface VacancyCardProps {
  id: string;
  title: string;
  title_en?: string;
  title_de?: string;
  title_es?: string;
  title_fr?: string;
  title_ru?: string;
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
  description_en?: string;
  description_de?: string;
  description_es?: string;
  description_fr?: string;
  description_ru?: string;
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
  [key: string]: any; // Allow extra props from spread
}

const VacancyCard: React.FC<VacancyCardProps> = ({
  id,
  title,
  title_en,
  title_de,
  title_es,
  title_fr,
  title_ru,
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
  showDescription = true,
  showRequirements = true,
  description,
  description_en,
  description_de,
  description_es,
  description_fr,
  description_ru,
  requirements,
  searchQuery,
  currentPage,
  selectedFilters,
}) => {
  const { t, currentLanguage } = useLanguage();
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();
  const daysAgo = getRandomDaysAgo();
  const [descOpen, setDescOpen] = useState(false);
  const [reqOpen, setReqOpen] = useState(false);
  
  // Resolve localized title and description
  const vacancyData = { title, title_en, title_de, title_es, title_fr, title_ru, description, description_en, description_de, description_es, description_fr, description_ru };
  const localizedTitle = getLocalizedVacancyField(vacancyData, 'title', currentLanguage as Language);
  const localizedDescription = getLocalizedVacancyField(vacancyData, 'description', currentLanguage as Language);
  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
     e.preventDefault();
     e.stopPropagation();
     if (onSaveToggle) {
       // Track vacancy saved
       if (!isSaved) {
         Analytics.vacancySaved(id, location);
       }
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
              <h3 className="text-lg font-semibold line-clamp-2">{localizedTitle}</h3>
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
            {specialty && (
              <Badge variant="outline" className="bg-muted/50">
                {specialty}
              </Badge>
            )}
            <Badge variant="outline" className="bg-muted/50">
              {getLocalizedJobType(jobType, currentLanguage as Language)}
            </Badge>
            {salary && (
              <Badge variant="outline" className="bg-muted/50">
                {localizeSalary(salary, currentLanguage as Language)}
              </Badge>
            )}
            {profession && (
              <Badge variant="outline" className="bg-muted/50">
                {getLocalizedProfession(profession, currentLanguage as Language)}
              </Badge>
            )}
            {isApplied && (
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                {t?.common?.applied || "Applied"}
              </Badge>
            )}
          </div>

          {/* Collapsible description */}
          {showDescription && localizedDescription && (
            <Collapsible open={descOpen} onOpenChange={setDescOpen} className="mt-4">
              <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium py-1.5 hover:text-primary transition-colors">
                <span>{t?.vacancies?.description || "Description"}</span>
                {descOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{localizedDescription}</p>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Collapsible requirements with better styling */}
          {showRequirements && requirements && requirements.length > 0 && (
            <Collapsible open={reqOpen} onOpenChange={setReqOpen} className="mt-3">
              <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium py-1.5 hover:text-primary transition-colors">
                <span>{t?.vacancies?.keyRequirements || "Key Requirements"}</span>
                {reqOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="mt-2 space-y-1.5">
                  {requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary/70 shrink-0" />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
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
            title={localizedTitle}
            isLandingPageCard={isLandingPageCard}
            fromLandingPage={fromLandingPage}
            isLoggedIn={isLoggedIn}
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
