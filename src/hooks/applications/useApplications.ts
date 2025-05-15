
import { useMemo } from 'react';
import { Application } from './types';
import { useFetchApplications } from './useFetchApplications';
import { useApplicationFilters } from './useApplicationFilters';
import { useUpdateApplicationStatus } from './useUpdateApplicationStatus';

export const useApplications = () => {
  const { applications, loading, error } = useFetchApplications();
  const { filteredApplications, searchQuery, filters, handleSearchQueryChange, handleFilterChange } = useApplicationFilters(applications);
  const { updateApplicationStatus, submitting } = useUpdateApplicationStatus();
  
  const applicationsByStatus = useMemo(() => {
    const result: Record<string, Application[]> = {
      pending: [],
      inReview: [],
      interview: [],
      approved: [],
      rejected: [],
      all: filteredApplications
    };

    filteredApplications.forEach(app => {
      const status = app.status.toLowerCase();
      if (result[status]) {
        result[status].push(app);
      }
    });

    return result;
  }, [filteredApplications]);

  // Add functions for refreshing applications and updating filters
  const refreshApplications = async () => {
    console.log('Refreshing applications...');
    // This would typically call a refresh method from useFetchApplications
    // For now, we'll just log it
  };

  const updateApplicationFilters = (newFilters: any) => {
    console.log('Updating application filters:', newFilters);
    // This would update filters in the useApplicationFilters hook
    // For now, we'll just log it
  };

  return {
    applications,
    filteredApplications,
    applicationsByStatus,
    searchQuery,
    filters,
    handleSearchQueryChange,
    handleFilterChange,
    loading,
    error,
    updateApplicationStatus,
    refreshApplications,
    updateApplicationFilters,
    submitting
  };
};
