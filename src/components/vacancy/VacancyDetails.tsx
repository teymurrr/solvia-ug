
import React from 'react';
import { MapPin, Calendar } from 'lucide-react';

interface VacancyDetailsProps {
  displayLocation: string;
  profession?: string;
  specialty?: string;
  postedDate?: string;
  description: string;
  requirements: string[];
}

const VacancyDetails: React.FC<VacancyDetailsProps> = ({
  displayLocation,
  profession,
  specialty,
  postedDate,
  description,
  requirements
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center text-gray-600">
        <MapPin className="h-5 w-5 mr-2 text-gray-500" />
        <span className="text-lg">{displayLocation}</span>
      </div>
      
      {postedDate && (
        <div className="text-gray-600 text-lg">
          Posted: {postedDate}
        </div>
      )}
      
      <p className="text-lg text-gray-700">
        {description}
      </p>
      
      {requirements && requirements.length > 0 && (
        <div>
          <h4 className="text-xl font-bold mb-4">Requirements:</h4>
          <ul className="text-lg text-gray-700 space-y-2 list-disc pl-6">
            {requirements.map((requirement, index) => (
              <li key={index}>{requirement}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VacancyDetails;
