
import { useState, useEffect } from 'react';
import { useFetchApplications } from './useFetchApplications';
import { useApplicationFilters } from './useApplicationFilters';
import { useUpdateApplicationStatus } from './useUpdateApplicationStatus';
import type { Application } from './types';

// Re-export using "export type" for TypeScript types
export type { Application } from './types';

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const { fetchApplications, loading, error } = useFetchApplications();
  const { 
    filteredApplications, 
    searchQuery, 
    filters, 
    handleSearchQueryChange, 
    handleFilterChange 
  } = useApplicationFilters(applications);
  
  const { updateApplicationStatus: updateStatus, submitting } = useUpdateApplicationStatus();

  // Wrap the update function to update local state as well
  const updateApplicationStatus = async (applicationId: string, newStatus: Application['status']) => {
    const success = await updateStatus(applicationId, newStatus, ({ id, status }) => {
      // Update local state
      setApplications(prev => 
        prev.map(app => app.id === id ? { ...app, status } : app)
      );
    });
    
    return success;
  };

  const refreshApplications = async () => {
    const fetchedApplications = await fetchApplications();
    setApplications(fetchedApplications);
  };

  // Fetch applications on component mount
  useEffect(() => {
    refreshApplications();
  }, []);

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
    submitting
  };
};
