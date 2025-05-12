
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface VacancyContentProps {
  specialty?: string;
  jobType: string;
  salary?: string;
  profession?: string;
  isApplied?: boolean;
  description?: string;
  requirements?: string[];
  createdAt?: string;
  applicationCount?: number;
  isDashboardCard?: boolean;
  showDescription?: boolean;
  showRequirements?: boolean;
}

const VacancyContent: React.FC<VacancyContentProps> = ({
  specialty,
  jobType,
  salary,
  profession,
  isApplied = false,
  description,
  requirements,
  createdAt,
  applicationCount,
  isDashboardCard = false,
  showDescription = false,
  showRequirements = false,
}) => {
  const { t } = useLanguage();
  
  return (
    <>
      <div className="flex flex-wrap gap-2 mt-3">
        {specialty && (
          <Badge variant="outline" className="bg-gray-50">
            {specialty}
          </Badge>
        )}
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
            {t?.common?.applied || "Applied"}
          </Badge>
        )}
      </div>

      {/* Display description if required */}
      {showDescription && description && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-1">{t?.vacancies?.description || "Description"}</h4>
          <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
        </div>
      )}

      {/* Display requirements if needed */}
      {showRequirements && requirements && requirements.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-1">{t?.vacancies?.keyRequirements || "Key Requirements"}</h4>
          <ul className="text-sm text-gray-600 pl-5">
            {requirements.slice(0, 3).map((requirement, index) => (
              <li key={index} className="list-disc">
                <span className="line-clamp-1">{requirement}</span>
              </li>
            ))}
            {requirements.length > 3 && (
              <li className="text-xs text-gray-500 list-none mt-1">
                + {requirements.length - 3} {t?.vacancies?.more || "more"}
              </li>
            )}
          </ul>
        </div>
      )}

      {createdAt && !isDashboardCard && (
        <div className="mt-4 flex items-center text-xs text-gray-500">
          <Calendar className="mr-1 h-3.5 w-3.5" />
          <span>{t?.vacancies?.posted || "Posted"} {createdAt}</span>
        </div>
      )}

      {isDashboardCard && applicationCount !== undefined && (
        <div className="mt-4 text-sm text-gray-600">
          {applicationCount} {applicationCount === 1 
            ? (t?.vacancies?.application || "application") 
            : (t?.vacancies?.applications || "applications")}
        </div>
      )}
    </>
  );
};

export default VacancyContent;
