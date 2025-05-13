
import { useState, useEffect } from 'react';
import { Application, ApplicationFilters } from './types';

export const useApplicationFilters = (applications: Application[]) => {
  const [filteredApplications, setFilteredApplications] = useState<Application[]>(applications);
  const [filters, setFilters] = useState<ApplicationFilters>({
    status: 'all_statuses',
    date: 'all_time'
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Apply filters and search
  const applyFilters = () => {
    let filtered = [...applications];
    
    // Apply status filter
    if (filters.status !== 'all_statuses') {
      filtered = filtered.filter(app => app.status === filters.status);
    }
    
    // Apply date filter
    if (filters.date !== 'all_time') {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (filters.date) {
        case 'today':
          cutoffDate.setDate(now.getDate() - 1);
          break;
        case 'this_week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'this_month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'this_year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(app => {
        const appDate = new Date(app.appliedDate);
        return appDate >= cutoffDate;
      });
    }
    
    // Apply search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.applicantName.toLowerCase().includes(query) ||
        app.vacancyTitle.toLowerCase().includes(query) ||
        (app.applicantEmail && app.applicantEmail.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  };

  // Handle search query change
  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle filter change
  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Update filtered applications when filters, search query, or applications change
  useEffect(() => {
    setFilteredApplications(applyFilters());
  }, [filters, searchQuery, applications]);

  return {
    filteredApplications,
    searchQuery,
    filters,
    handleSearchQueryChange,
    handleFilterChange
  };
};
