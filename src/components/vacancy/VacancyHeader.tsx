
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
  onSaveToggle?: (id: string) => void;
}

const VacancyHeader: React.FC<VacancyHeaderProps> = ({
  id,
  title,
  institution,
  jobType,
  showSaveOption = false,
  isSaved = false,
  onSaveToggle,
}) => {
  return (
    <div className="flex flex-wrap justify-between items-start gap-2">
      <div className="flex-1">
        <Link to={`/vacancies/${id}`} className="text-2xl font-bold text-black hover:text-primary transition-colors">
          {title}
        </Link>
        <div className="flex items-center text-gray-600 mt-2">
          <Building className="h-5 w-5 mr-2 text-gray-500" />
          <span className="text-lg">{institution}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {showSaveOption && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onSaveToggle?.(id)}
            title={isSaved ? "Remove from saved" : "Save for later"}
          >
            {isSaved ? (
              <BookmarkCheck className="h-5 w-5 text-primary" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </Button>
        )}
        <Badge variant={getJobTypeBadgeVariant(jobType)} className="text-sm px-4 py-1 rounded-full">
          {jobType}
        </Badge>
      </div>
    </div>
  );
};

export default VacancyHeader;
