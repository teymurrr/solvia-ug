
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface VacancyFooterProps {
  id: string;
}

const VacancyFooter: React.FC<VacancyFooterProps> = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/signup/professional');
  };

  return (
    <div className="pt-2 flex justify-between gap-2">
      <Button variant="outline" onClick={handleRedirect} className="flex-shrink-0">
        View Details
      </Button>
      <Button onClick={handleRedirect} className="ml-auto">
        Apply Now
      </Button>
    </div>
  );
};

export default VacancyFooter;
