
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Application, ApplicationFilters } from './types';
import { useApplicationFilters } from './useApplicationFilters';
import { useUpdateApplicationStatus } from './useUpdateApplicationStatus';

export const useApplications = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const { updateApplicationStatus, submitting } = useUpdateApplicationStatus();
  
  // Get filter functionality from the useApplicationFilters hook
  const {
    filteredApplications,
    searchQuery,
    filters,
    handleSearchQueryChange,
    handleFilterChange
  } = useApplicationFilters(applications);

  // Fetch applications data
  const fetchApplicationsQuery = useQuery({
    queryKey: ['applications', session?.user?.id],
    queryFn: async (): Promise<Application[]> => {
      if (!session?.user) {
        return [];
      }

      try {
        const { data, error } = await supabase
          .from('applied_vacancies')
          .select(`
            *,
            vacancy:vacancy_id (
              id,
              title,
              institution,
              location,
              posted_date
            )
          `)
          .eq('user_id', session.user.id)
          .order('application_date', { ascending: false });

        if (error) {
          throw error;
        }

        if (!data || data.length === 0) {
          return [];
        }

        // Transform the data to match our Application interface
        const formattedApplications: Application[] = data.map(item => {
          // Map database status to our application status type
          let typedStatus: Application['status'] = 'pending'; // Default
          if (['pending', 'reviewing', 'accepted', 'rejected'].includes(item.status)) {
            typedStatus = item.status as Application['status'];
          } else if (item.status === 'reviewed') {
            typedStatus = 'reviewing'; // Map 'reviewed' to 'reviewing'
          }

          // Extract application data
          const appData = item.application_data || {};
          
          return {
            id: item.id,
            applicantId: item.user_id,
            applicantName: appData.firstName && appData.lastName 
              ? `${appData.firstName} ${appData.lastName}` 
              : 'Unnamed Applicant',
            applicantPhoto: appData.profileImage,
            applicantEmail: appData.email,
            applicantPhone: appData.phone,
            vacancyId: item.vacancy_id,
            vacancyTitle: item.vacancy?.title || 'Unknown Position',
            appliedDate: new Date(item.application_date).toLocaleDateString(),
            status: typedStatus,
            coverLetter: appData.coverLetter,
            cvFileName: appData.cvFileName
          };
        });

        setApplications(formattedApplications);
        return formattedApplications;
      } catch (err: any) {
        console.error("Error fetching applications:", err);
        toast({
          title: "Error",
          description: err.message || "Failed to fetch applications",
          variant: "destructive"
        });
        return [];
      }
    },
    enabled: !!session?.user
  });

  // Handle application status update
  const handleUpdateStatus = async (applicationId: string, newStatus: Application['status']) => {
    const success = await updateApplicationStatus(applicationId, newStatus);
    if (success) {
      // Update local state
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
      return true;
    }
    return false;
  };

  // Refresh applications
  const refreshApplications = () => {
    fetchApplicationsQuery.refetch();
  };

  // Set applications when query data changes
  useEffect(() => {
    if (fetchApplicationsQuery.data) {
      setApplications(fetchApplicationsQuery.data);
    }
  }, [fetchApplicationsQuery.data]);

  return {
    applications,
    filteredApplications,
    loading: fetchApplicationsQuery.isLoading || submitting,
    error: fetchApplicationsQuery.error ? (fetchApplicationsQuery.error as Error).message : null,
    searchQuery,
    filters,
    handleSearchQueryChange,
    handleFilterChange,
    updateApplicationStatus: handleUpdateStatus,
    refreshApplications
  };
};
