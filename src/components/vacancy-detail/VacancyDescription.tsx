
import React from 'react';

interface VacancyDescriptionProps {
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
}

const VacancyDescription: React.FC<VacancyDescriptionProps> = ({
  description,
  responsibilities,
  requirements,
  benefits,
}) => {
  return (
    <div className="space-y-8">
      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Description</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      {/* Responsibilities */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Responsibilities</h2>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          {responsibilities.map((responsibility, index) => (
            <li key={index}>{responsibility}</li>
          ))}
        </ul>
      </div>
      
      {/* Requirements */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Requirements</h2>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          {requirements.map((requirement, index) => (
            <li key={index}>{requirement}</li>
          ))}
        </ul>
      </div>
      
      {/* Benefits */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Benefits</h2>
        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
          {benefits.map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VacancyDescription;
