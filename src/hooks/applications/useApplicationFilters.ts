
import { useState, useEffect } from 'react';
import { Application, ApplicationFilter } from './types';

export const useApplicationFilters = (applications: Application[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ApplicationFilter>({
    status: 'all',
    date: 'all'
  });
  const [filteredApplications, setFilteredApplications] = useState<Application[]>(applications);

  useEffect(() => {
    filterApplications();
  }, [applications, searchQuery, filters]);

  const filterApplications = () => {
    let filtered = [...applications];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => {
        const applicantName = app.applicantName?.toLowerCase() || '';
        const vacancyTitle = app.vacancyTitle?.toLowerCase() || '';
        return applicantName.includes(query) || vacancyTitle.includes(query);
      });
    }

    // Filter by status
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(app => app.status === filters.status);
    }

    // Filter by date (simplified - in a real app you'd use proper date filtering)
    if (filters.date && filters.date !== 'all') {
      // Example implementation - would be more sophisticated in a real app
      const currentDate = new Date();
      const oneMonth = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
      
      filtered = filtered.filter(app => {
        const appDate = new Date(app.application_date).getTime();
        const diffTime = currentDate.getTime() - appDate;
        
        if (filters.date === 'last_month') {
          return diffTime <= oneMonth;
        }
        return true;
      });
    }

    setFilteredApplications(filtered);
  };

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Add method to update application filters directly
  const updateApplicationFilters = (newFilters: Partial<ApplicationFilter>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  return {
    filteredApplications,
    searchQuery,
    filters,
    handleSearchQueryChange,
    handleFilterChange,
    updateApplicationFilters
  };
};
