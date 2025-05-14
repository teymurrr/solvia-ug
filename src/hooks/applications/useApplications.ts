
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Application, ApplicationStatus, ApplicationData, ApplicationFilter } from './types';
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
              posted_date,
              department,
              description,
              requirements,
              job_type
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
        const formattedApplications = data.map(item => {
          // Map database status to our application status type
          let typedStatus: ApplicationStatus = 'pending'; // Default
          if (['pending', 'reviewing', 'reviewed', 'shortlisted', 'interview', 'accepted', 'rejected'].includes(item.status)) {
            typedStatus = item.status as ApplicationStatus;
          }

          // Safely cast and extract application data
          const appData = item.application_data as ApplicationData || {};
          
          const application: Application = {
            id: item.id,
            user_id: item.user_id,
            vacancy_id: item.vacancy_id,
            application_date: item.application_date,
            status: typedStatus,
            application_data: appData,
            vacancy: item.vacancy ? {
              id: item.vacancy.id,
              title: item.vacancy.title,
              institution: item.vacancy.institution,
              department: item.vacancy.department || '',
              location: item.vacancy.location,
              description: item.vacancy.description || '',
              requirements: item.vacancy.requirements || null,
              job_type: item.vacancy.job_type || ''
            } : undefined,
            // Enhanced properties for UI display
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
            coverLetter: appData.coverLetter,
            cvFileName: appData.cvFileName
          };

          return application;
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
  const handleUpdateStatus = async (applicationId: string, newStatus: ApplicationStatus) => {
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
