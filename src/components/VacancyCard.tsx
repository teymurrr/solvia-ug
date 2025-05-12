
import React from 'react';
import VacancyCardContainer from './vacancy/VacancyCardContainer';
import { VacancyCardProps } from './vacancy/types';

// This is just a wrapper around VacancyCardContainer to maintain backward compatibility
const VacancyCard: React.FC<VacancyCardProps> = (props) => {
  return <VacancyCardContainer {...props} />;
};

export default VacancyCard;
