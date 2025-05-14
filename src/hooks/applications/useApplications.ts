
import { useState, useCallback } from 'react';
import { Application, ApplicationStatus } from './types';
import { useFetchApplications } from './useFetchApplications';
import { useApplicationFilters } from './useApplicationFilters';
import { useUpdateApplicationStatus } from './useUpdateApplicationStatus';

export const useApplications = () => {
  const { applications, loading, error, refreshApplications } = useFetchApplications();
  const { filters, updateApplicationFilters } = useApplicationFilters();
  const { updateApplicationStatus } = useUpdateApplicationStatus();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter applications based on search query and filters
  const filteredApplications = applications.filter(app => {
    // Search filter
    const matchesSearch = !searchQuery || 
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.vacancyTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = filters.status === 'all' || app.status === filters.status;
    
    // Date filter (placeholder - can be enhanced)
    const matchesDate = filters.date === 'all'; // Default to match all
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Handler for search query changes
  const handleSearchQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  // Handler for filter changes
  const handleFilterChange = useCallback((filterKey: keyof typeof filters, value: string) => {
    updateApplicationFilters(filterKey, value);
  }, [updateApplicationFilters]);

  return {
    applications,
    filteredApplications,
    loading,
    error,
    searchQuery,
    filters,
    handleSearchQueryChange,
    handleFilterChange,
    updateApplicationStatus,
    refreshApplications,
    updateApplicationFilters
  };
};
