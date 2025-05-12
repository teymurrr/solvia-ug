
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Building, ArrowLeft } from 'lucide-react';
import { getJobTypeBadgeVariant } from '@/components/vacancy/utils';

interface VacancyHeaderProps {
  title: string;
  institution: string;
  jobType: string;
  onGoBack: () => void;
}

const VacancyHeader: React.FC<VacancyHeaderProps> = ({
  title,
  institution,
  jobType,
  onGoBack,
}) => {
  return (
    <div>
      <button 
        onClick={onGoBack} 
        className="inline-flex items-center text-primary hover:underline mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Dashboard
      </button>
      
      <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <div className="flex items-center text-muted-foreground mt-1">
            <Building className="h-4 w-4 mr-1" />
            <span className="text-lg">{institution}</span>
          </div>
        </div>
        <Badge variant={getJobTypeBadgeVariant(jobType)} className="whitespace-nowrap">
          {jobType}
        </Badge>
      </div>
    </div>
  );
};

export default VacancyHeader;
