
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
    <div className="pt-2 flex justify-between">
      <Button variant="outline" onClick={handleRedirect}>View Details</Button>
      <Button onClick={handleRedirect}>Apply Now</Button>
    </div>
  );
};

export default VacancyFooter;
