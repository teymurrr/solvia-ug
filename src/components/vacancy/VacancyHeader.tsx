
import React from 'react';
import { Building2, MapPin, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VacancyHeaderProps {
  id: string;
  title: string;
  institution: string;
  location: string;
  showSaveOption?: boolean;
  isSaved?: boolean;
  onSaveToggle?: (id: string) => void;
}

const VacancyHeader: React.FC<VacancyHeaderProps> = ({
  id,
  title,
  institution,
  location,
  showSaveOption = true,
  isSaved = false,
  onSaveToggle,
}) => {
  // Create a handler that accepts the click event but calls onSaveToggle with the id
  const handleSaveToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSaveToggle) {
      onSaveToggle(id);
    }
  };

  return (
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
          onClick={handleSaveToggle}
        >
          {isSaved ? (
            <BookmarkCheck className="h-5 w-5 text-red-500 fill-red-500" />
          ) : (
            <BookmarkCheck className="h-5 w-5 text-gray-400 hover:text-red-500" />
          )}
        </Button>
      )}
    </div>
  );
};

export default VacancyHeader;
