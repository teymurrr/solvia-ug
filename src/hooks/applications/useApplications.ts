
import { useMemo } from 'react';
import { Application } from './types';
import { useFetchApplications } from './useFetchApplications';
import { useApplicationFilters } from './useApplicationFilters';
import { useUpdateApplicationStatus } from './useUpdateApplicationStatus';

export const useApplications = () => {
  const { applications, loading, error, refreshApplications } = useFetchApplications();
  const { filteredApplications, searchQuery, filters, handleSearchQueryChange, handleFilterChange, updateApplicationFilters } = useApplicationFilters(applications);
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

  // Function for refreshing applications, now properly typed
  const handleRefreshApplications = async () => {
    console.log('Refreshing applications...');
    return await refreshApplications();
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
    refreshApplications: handleRefreshApplications,
    updateApplicationFilters,
    submitting
  };
};
