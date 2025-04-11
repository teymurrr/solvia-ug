
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Briefcase, MapPin, Calendar, Building, Medal, Bookmark, BookmarkCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProtectedAction } from '@/hooks/useProtectedAction';

interface VacancyCardProps {
  id: string;
  title: string;
  institution: string;
  location?: string;
  jobType: string;
  specialty?: string;
  profession?: string;
  description: string;
  requirements: string[];
  postedDate?: string;
  applicationDeadline?: string;
  showSaveOption?: boolean;
  isSaved?: boolean;
  onSaveToggle?: (id: string) => void;
  // Optional props for backward compatibility with existing data
  country?: string;
  city?: string;
  salary?: string;
}

const VacancyCard = ({
  id,
  title,
  institution,
  location,
  jobType,
  specialty,
  profession,
  description,
  requirements,
  postedDate,
  applicationDeadline,
  showSaveOption = false,
  isSaved = false,
  onSaveToggle,
  country,
  city,
}: VacancyCardProps) => {
  const { toast } = useToast();
  const { handleProtectedAction } = useProtectedAction();
  
  // Create a location string if individual components are provided
  const displayLocation = location || (city && country ? `${city}, ${country}` : city || country || "Location not specified");
  
  // Format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Date not specified";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  // Calculate days remaining until deadline
  const calculateDaysRemaining = () => {
    if (!applicationDeadline) return null;
    const today = new Date();
    const deadline = new Date(applicationDeadline);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const daysRemaining = calculateDaysRemaining();
  
  // Get badge variant based on job type
  const getJobTypeBadgeVariant = (type: string) => {
    switch(type) {
      case 'Full-time':
        return 'default';
      case 'Part-time':
        return 'secondary';
      case 'Internship':
        return 'outline';
      case 'Volunteer':
        return 'destructive';
      default:
        return 'default';
    }
  };

  // Handle save/unsave vacancy
  const toggleSave = () => {
    handleProtectedAction(() => {
      if (onSaveToggle) {
        onSaveToggle(id);
        
        toast({
          title: isSaved ? "Vacancy removed from saved" : "Vacancy saved",
          description: isSaved 
            ? "The vacancy has been removed from your saved list" 
            : "The vacancy has been saved for later",
        });
      }
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap justify-between items-start gap-2">
          <div>
            <Link to={`/vacancies/${id}`} className="text-xl font-semibold hover:text-primary transition-colors">
              {title}
            </Link>
            <div className="flex items-center text-muted-foreground mt-1">
              <Building className="h-4 w-4 mr-1" />
              <span className="text-sm">{institution}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {showSaveOption && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={toggleSave}
                title={isSaved ? "Remove from saved" : "Save for later"}
              >
                {isSaved ? (
                  <BookmarkCheck className="h-5 w-5 text-primary" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </Button>
            )}
            <Badge variant={getJobTypeBadgeVariant(jobType)} className="whitespace-nowrap">
              {jobType}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{displayLocation}</span>
          </div>
          {(profession || specialty) && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4 mr-2" />
              <span>{profession} {specialty ? `• ${specialty}` : ''}</span>
            </div>
          )}
          {postedDate && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Posted: {formatDate(postedDate)}</span>
            </div>
          )}
          {applicationDeadline && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              <span className={daysRemaining !== null && daysRemaining < 7 ? 'text-destructive font-medium' : ''}>
                {daysRemaining !== null ? (
                  daysRemaining <= 0 
                    ? 'Deadline passed' 
                    : `Deadline: ${formatDate(applicationDeadline)} (${daysRemaining} days left)`
                ) : (
                  `Deadline: ${formatDate(applicationDeadline)}`
                )}
              </span>
            </div>
          )}
        </div>
        
        <p className="text-sm mb-4 line-clamp-3">{description}</p>
        
        <div className="space-y-2">
          <div className="flex items-start">
            <Medal className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <div>
              <h4 className="text-sm font-medium">Requirements:</h4>
              <ul className="text-sm text-muted-foreground ml-5 list-disc">
                {requirements.slice(0, 3).map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
                {requirements.length > 3 && (
                  <li>+{requirements.length - 3} more</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between">
        <Button variant="outline" asChild>
          <Link to={`/vacancies/${id}`}>View Details</Link>
        </Button>
        <Button>Apply Now</Button>
      </CardFooter>
    </Card>
  );
};

export default VacancyCard;
