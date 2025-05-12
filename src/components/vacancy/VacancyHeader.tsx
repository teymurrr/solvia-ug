
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Bookmark, BookmarkCheck, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VacancyHeaderProps {
  id: string;
  title: string;
  institution: string;
  jobType: string;
  showSaveOption?: boolean;
  isSaved?: boolean;
  isApplied?: boolean;
  onSaveToggle?: (id: string) => void;
  isDashboardCard?: boolean;
}

const VacancyHeader: React.FC<VacancyHeaderProps> = ({
  id,
  title,
  institution,
  jobType,
  showSaveOption = false,
  isSaved = false,
  isApplied = false,
  onSaveToggle,
  isDashboardCard = false
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
  
  // Updated handle function to match required signature
  const handleSaveToggle = (e: React.MouseEvent) => {
    if (onSaveToggle) {
      e.stopPropagation();
      onSaveToggle(id);
    }
  };
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-start">
        <div>
          <h3 className={cn("font-bold", {
            "text-lg": isDashboardCard,
            "text-xl": !isDashboardCard
          })}>
            {title}
          </h3>
          <p className={cn("text-muted-foreground", {
            "text-sm": isDashboardCard
          })}>
            {institution}
          </p>
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
          
          {showSaveOption && onSaveToggle && (
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
    </div>
  );
};

export default VacancyHeader;
