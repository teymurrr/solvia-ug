
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface VacancyFooterProps {
  id: string;
}

const VacancyFooter: React.FC<VacancyFooterProps> = ({ id }) => {
  return (
    <div className="pt-2 flex justify-between">
      <Button variant="outline" asChild>
        <Link to={`/vacancies/${id}`}>View Details</Link>
      </Button>
      <Button>Apply Now</Button>
    </div>
  );
};

export default VacancyFooter;
