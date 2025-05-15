
import { useMemo } from 'react';
import { Application } from './types';
import { useFetchApplications } from './useFetchApplications';
import { useApplicationFilters } from './useApplicationFilters';

export const useApplications = () => {
  const { applications, loading, error } = useFetchApplications();
  const { filteredApplications, searchQuery, filters, handleSearchQueryChange, handleFilterChange } = useApplicationFilters(applications);
  
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

  return {
    applications,
    filteredApplications,
    applicationsByStatus,
    searchQuery,
    filters,
    handleSearchQueryChange,
    handleFilterChange,
    loading,
    error
  };
};
