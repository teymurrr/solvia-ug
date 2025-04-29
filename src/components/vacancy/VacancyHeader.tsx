
import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getJobTypeBadgeVariant } from './utils';

interface VacancyHeaderProps {
  id: string;
  title: string;
  institution: string;
  jobType: string;
  showSaveOption?: boolean;
  isSaved?: boolean;
  onSaveToggle?: (e: React.MouseEvent) => void;
  isDashboardCard?: boolean;
}

const VacancyHeader: React.FC<VacancyHeaderProps> = ({
  id,
  title,
  institution,
  jobType,
  showSaveOption = false,
  isSaved = false,
  onSaveToggle,
  isDashboardCard = false,
}) => {
  // Adjust title size based on whether it's a dashboard card
  const titleClasses = isDashboardCard 
    ? "text-lg font-semibold hover:text-primary transition-colors" 
    : "text-xl font-semibold hover:text-primary transition-colors";

  // Since the entire card is clickable now, we don't need a separate link
  return (
    <div className="flex flex-wrap justify-between items-start gap-2">
      <div>
        <div className={titleClasses.replace('hover:text-primary', '')}>
          {title}
        </div>
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
            onClick={onSaveToggle}
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
  );
};

export default VacancyHeader;
