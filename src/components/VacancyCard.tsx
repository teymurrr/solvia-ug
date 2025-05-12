
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { BookmarkIcon } from '@radix-ui/react-icons';
import { Building2, MapPin, Calendar } from 'lucide-react'; 
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import VacancyFooter from './vacancy/VacancyFooter';

export interface VacancyCardProps {
  id: string;
  title: string;
  institution: string;
  location: string;
  jobType: string;
  specialty: string;
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
  showDescription?: boolean;
  showRequirements?: boolean;
  searchQuery?: string;
  currentPage?: number;
  selectedFilters?: any;
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
  showDescription = false,
  showRequirements = false,
  description,
  requirements,
  // Added these props but they're not used internally
  searchQuery,
  currentPage,
  selectedFilters,
}) => {
  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSaveToggle) {
      onSaveToggle(id);
    }
  };

  return (
    <Card className={cn("h-full border hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-0">
        <Link to={`/vacancies/${id}`} className="block h-full">
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
                    <BookmarkIcon className="h-5 w-5 text-primary" />
                  ) : (
                    <BookmarkIcon className="h-5 w-5" />
                  )}
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline" className="bg-gray-50">
                {specialty}
              </Badge>
              <Badge variant="outline" className="bg-gray-50">
                {jobType}
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
                  Applied
                </Badge>
              )}
            </div>

            {/* Display description if required */}
            {showDescription && description && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
              </div>
            )}

            {/* Display requirements if needed */}
            {showRequirements && requirements && requirements.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-1">Key Requirements</h4>
                <ul className="text-sm text-gray-600 pl-5">
                  {requirements.slice(0, 3).map((requirement, index) => (
                    <li key={index} className="list-disc">
                      <span className="line-clamp-1">{requirement}</span>
                    </li>
                  ))}
                  {requirements.length > 3 && (
                    <li className="text-xs text-gray-500 list-none mt-1">+ {requirements.length - 3} more</li>
                  )}
                </ul>
              </div>
            )}

            {createdAt && !isDashboardCard && (
              <div className="mt-4 flex items-center text-xs text-gray-500">
                <Calendar className="mr-1 h-3.5 w-3.5" />
                <span>Posted {createdAt}</span>
              </div>
            )}

            {isDashboardCard && applicationCount !== undefined && (
              <div className="mt-4 text-sm text-gray-600">
                {applicationCount} {applicationCount === 1 ? 'application' : 'applications'}
              </div>
            )}
          </div>
        </Link>

        {/* Apply button at the bottom of card */}
        {(isLandingPageCard || fromLandingPage) && (
          <div className="px-5 pb-5 pt-2">
            <VacancyFooter 
              id={id}
              isLandingPageCard={true}
              fromLandingPage={true}
              isLoggedIn={false}
              isApplied={isApplied}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VacancyCard;
