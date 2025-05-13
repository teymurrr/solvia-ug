
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Application, ApplicationData } from './types';

export const useFetchApplications = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async (): Promise<Application[]> => {
    if (!user?.id) {
      setLoading(false);
      setError('Authentication required');
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      
      // Fetch all vacancies owned by this institution
      const { data: institutionVacancies, error: vacanciesError } = await supabase
        .from('vacancies')
        .select('id')
        .eq('institution_id', user.id);
      
      if (vacanciesError) {
        throw vacanciesError;
      }
      
      // If no vacancies, return empty applications
      if (!institutionVacancies || institutionVacancies.length === 0) {
        setLoading(false);
        return [];
      }
      
      const vacancyIds = institutionVacancies.map(v => v.id);
      
      // Get applications for these vacancies
      const { data, error: applicationsError } = await supabase
        .from('applied_vacancies')
        .select(`
          id,
          vacancy_id,
          user_id,
          application_date,
          status,
          application_data,
          vacancies:vacancy_id (
            title
          )
        `)
        .in('vacancy_id', vacancyIds)
        .order('application_date', { ascending: false });
      
      if (applicationsError) {
        throw applicationsError;
      }
      
      // If no data, return empty applications
      if (!data || data.length === 0) {
        setLoading(false);
        return [];
      }

      // Get user details for each application
      const formattedApplications: Application[] = await Promise.all(data.map(async (application) => {
        // Fetch user profile data
        const { data: userData, error: userError } = await supabase
          .from('professional_profiles')
          .select('first_name, last_name, profile_image')
          .eq('id', application.user_id)
          .single();
        
        // Safely parse application_data as ApplicationData or empty object if null
        const applicationData = application.application_data as ApplicationData || {};
        
        // Validate the status is one of the allowed values
        let typedStatus: Application['status'] = 'pending'; // Default fallback
        if (['pending', 'reviewing', 'accepted', 'rejected'].includes(application.status)) {
          typedStatus = application.status as Application['status'];
        }
        
        // Format the application data to match the Application interface
        return {
          id: application.id,
          applicantId: application.user_id,
          applicantName: userData 
            ? `${userData.first_name} ${userData.last_name}`
            : applicationData?.firstName && applicationData?.lastName
              ? `${applicationData.firstName} ${applicationData.lastName}` 
              : 'Unknown Applicant',
          applicantPhoto: userData?.profile_image || undefined,
          applicantEmail: applicationData?.email,
          applicantPhone: applicationData?.phone,
          vacancyId: application.vacancy_id,
          vacancyTitle: application.vacancies?.title || 'Unknown Position',
          appliedDate: new Date(application.application_date).toLocaleDateString(),
          status: typedStatus,
          coverLetter: applicationData?.coverLetter,
          cvFileName: applicationData?.cvFileName
        };
      }));

      return formattedApplications;
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      setError(err.message || 'Failed to fetch applications');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchApplications,
    loading,
    error
  };
};
