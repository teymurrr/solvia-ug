
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
    <div className="flex justify-between gap-4">
      <Button 
        variant="outline" 
        onClick={handleRedirect} 
        className="px-6 py-2 text-base font-medium border-gray-300"
      >
        View Details
      </Button>
      <Button 
        onClick={handleRedirect} 
        className="px-6 py-2 text-base font-medium bg-blue-500 hover:bg-blue-600"
      >
        Apply Now
      </Button>
    </div>
  );
};

export default VacancyFooter;
