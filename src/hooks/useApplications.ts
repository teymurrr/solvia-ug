
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Application {
  id: string;
  user_id: string;
  vacancy_id: string;
  application_date: string;
  status: 'pending' | 'reviewed' | 'interview' | 'rejected' | 'accepted';
  application_data?: any;
  updated_at: string;
  vacancy?: {
    id: string;
    title: string;
    institution: string;
    location: string;
    posted_date: string;
  };
}

export const useApplications = () => {
  const { session } = useAuth();

  const fetchApplications = async (): Promise<Application[]> => {
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
          posted_date
        )
      `)
      .eq('user_id', session.user.id)
      .order('application_date', { ascending: false });

    if (error) {
      console.error("Error fetching applications:", error);
      throw error;
    }

    return data || [];
  };

  return useQuery({
    queryKey: ['applications', session?.user?.id],
    queryFn: fetchApplications,
    enabled: !!session?.user
  });
};
