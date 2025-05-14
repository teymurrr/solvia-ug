
import { useState, useMemo } from 'react';
import { Application, ApplicationStatus, ApplicationFilter } from './types';

export const useApplicationFilters = (applications: Application[]) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<ApplicationFilter>({
    status: 'all',
    searchQuery: ''
  });

  const handleSearchQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setFilters(prev => ({ ...prev, searchQuery: event.target.value }));
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      [filterName]: value === 'all' ? 'all' : value as ApplicationStatus
    }));
  };

  const filteredApplications = useMemo(() => {
    if (!applications || applications.length === 0) {
      return [];
    }

    return applications.filter(app => {
      // Filter by status
      const statusMatch = filters.status === 'all' || app.status === filters.status;

      // Check if we need to apply search filters
      if (!filters.searchQuery) {
        return statusMatch;
      }

      const search = filters.searchQuery.toLowerCase();
      
      // Apply search to all fields
      const searchInDate = app.appliedDate 
        ? app.appliedDate.toLowerCase().includes(search)
        : false;
      
      const searchInName = app.applicantName 
        ? app.applicantName.toLowerCase().includes(search) 
        : false;
      
      const searchInPosition = app.vacancyTitle 
        ? app.vacancyTitle.toLowerCase().includes(search) 
        : false;
        
      const searchInEmail = app.applicantEmail 
        ? app.applicantEmail.toLowerCase().includes(search) 
        : false;

      return statusMatch && (searchInDate || searchInName || searchInPosition || searchInEmail);
    });
  }, [applications, filters]);

  return {
    filteredApplications,
    searchQuery,
    filters,
    handleSearchQueryChange,
    handleFilterChange
  };
};
