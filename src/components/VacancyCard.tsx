import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck, FileCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VacancyCardProps {
  id: string;
  title: string;
  institution: string;
  location: string;
  jobType: string;
  salary: string;
  description: string;
  isSaved?: boolean;
  isApplied?: boolean;
  applicationLink?: string;
  onSaveToggle?: (id: string) => void;
  fromDashboard?: boolean;
  fromLandingPage?: boolean;
  searchQuery?: string;
  currentPage?: number;
  selectedFilters?: any;
  isLandingPageCard?: boolean;
  isLoggedIn?: boolean;
}

const VacancyCard: React.FC<VacancyCardProps> = ({
  id,
  title,
  institution,
  location,
  jobType,
  salary,
  description,
  isSaved = false,
  isApplied = false,
  applicationLink,
  onSaveToggle,
  fromDashboard = false,
  fromLandingPage = false,
  searchQuery,
  currentPage,
  selectedFilters,
  isLandingPageCard = false,
  isLoggedIn = false
}) => {
  const getJobTypeBadgeVariant = (type: string) => {
    switch(type.toLowerCase()) {
      case 'full-time':
        return 'default';
      case 'part-time':
        return 'secondary';
      case 'temporary':
      case 'locum': 
        return 'outline';
      case 'internship':
        return 'destructive';
      default:
        return 'default';
    }
  };

  // Fix the type issue in the handleSaveToggle function
  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSaveToggle) {
      onSaveToggle(id);
    }
  };

  return (
    <Card className="bg-white shadow-md rounded-lg overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription>{institution}</CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            {isApplied && (
              <Badge className="bg-blue-500">
                <FileCheck className="h-3 w-3 mr-1" />
                Applied
              </Badge>
            )}
            
            <Badge variant={getJobTypeBadgeVariant(jobType)}>
              {jobType}
            </Badge>
            
            {onSaveToggle && !isLandingPageCard && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleSaveToggle}
              >
                {isSaved ? (
                  <BookmarkCheck className="h-5 w-5 text-primary" />
                ) : (
                  <Bookmark className="h-5 w-5 text-muted-foreground" />
                )}
                <span className="sr-only">
                  {isSaved ? 'Remove from saved' : 'Save vacancy'}
                </span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        <div className="text-sm text-muted-foreground">
          <p>
            <span className="font-medium">Location:</span> {location}
          </p>
          <p>
            <span className="font-medium">Salary:</span> {salary}
          </p>
        </div>
        <p className="text-sm">
          {description.length > 200 ? `${description.substring(0, 200)}...` : description}
        </p>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center">
        {/* Apply Button or View Details */}
        <div className="w-full flex justify-end">
          {isLandingPageCard ? (
            <Link
              to={`/vacancies/${id}`}
              className={cn(
                Button,
                "w-full"
              )}
            >
              Apply Now
            </Link>
          ) : (
            <Link
              to={`/vacancies/${id}`}
              className={cn(
                Button,
                "w-full"
              )}
            >
              View Details
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default VacancyCard;
