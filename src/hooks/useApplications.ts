
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Application, ApplicationData } from '@/hooks/applications/types';

export type { Application } from '@/hooks/applications/types';

export const useApplications = () => {
  const { session } = useAuth();

  // For backward compatibility with the original implementation
  return useQuery({
    queryKey: ['applications', session?.user?.id],
    queryFn: async (): Promise<Application[]> => {
      if (!session?.user) {
        return [];
      }

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
            job_type,
            requirements
          )
        `)
        .eq('user_id', session.user.id)
        .order('application_date', { ascending: false });

      if (error) {
        console.error("Error fetching applications:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        return [];
      }

      // Transform data to match our Application interface
      return data.map(item => {
        // Map database status to our application status type
        let typedStatus: Application['status'] = 'pending'; // Default
        if (['pending', 'reviewing', 'accepted', 'rejected'].includes(item.status)) {
          typedStatus = item.status as Application['status'];
        } else if (item.status === 'reviewed') {
          typedStatus = 'reviewing'; // Map 'reviewed' to 'reviewing'
        }

        // Safely cast and extract application data
        const appData = (item.application_data || {}) as ApplicationData;
        
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
          cvFileName: appData.cvFileName,
          user_id: item.user_id,
          vacancy_id: item.vacancy_id,
          application_date: item.application_date,
          application_data: appData,
          vacancy: item.vacancy ? {
            id: item.vacancy.id,
            title: item.vacancy.title,
            institution: item.vacancy.institution,
            department: item.vacancy.department || '',
            location: item.vacancy.location,
            description: item.vacancy.description || '',
            job_type: item.vacancy.job_type || '',
            requirements: item.vacancy.requirements || []
          } : undefined
        };
      });
    },
    enabled: !!session?.user
  });
};
