
import { useState, useEffect, useCallback } from 'react';
import { Application, ApplicationStatus } from './types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useFetchApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const { user } = useAuth();

  const fetchApplications = useCallback(async () => {
    if (!user?.id) {
      setApplications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch applications for vacancies owned by this institution
      const { data: appData, error: appError } = await supabase
        .from('applied_vacancies')
        .select(`
          id,
          vacancy_id,
          user_id,
          application_date,
          status,
          application_data,
          institution_notes,
          created_at,
          updated_at
        `)
        .order('application_date', { ascending: false });

      if (appError) throw appError;

      if (!appData || appData.length === 0) {
        setApplications([]);
        setError('');
        setLoading(false);
        return;
      }

      // Get vacancy details for these applications
      const vacancyIds = [...new Set(appData.map(a => a.vacancy_id))];
      const { data: vacancyData } = await supabase
        .from('vacancies')
        .select('id, title, institution, location, institution_id')
        .in('id', vacancyIds);

      // Filter to only applications for this institution's vacancies
      const institutionVacancyIds = new Set(
        (vacancyData || [])
          .filter(v => v.institution_id === user.id)
          .map(v => v.id)
      );

      const relevantApps = appData.filter(a => institutionVacancyIds.has(a.vacancy_id));

      // Get professional profiles for applicants
      const userIds = [...new Set(relevantApps.map(a => a.user_id))];
      const { data: profileData } = await supabase
        .from('professional_profiles')
        .select('id, first_name, last_name, specialty, profile_image, email')
        .in('id', userIds);

      const vacancyMap = new Map((vacancyData || []).map(v => [v.id, v]));
      const profileMap = new Map((profileData || []).map(p => [p.id, p]));

      const enrichedApps: Application[] = relevantApps.map(app => {
        const vacancy = vacancyMap.get(app.vacancy_id);
        const profile = profileMap.get(app.user_id);
        const appDataParsed = typeof app.application_data === 'string' 
          ? JSON.parse(app.application_data) 
          : app.application_data;

        return {
          id: app.id,
          vacancy_id: app.vacancy_id,
          user_id: app.user_id,
          application_date: new Date(app.application_date).toLocaleDateString(),
          status: app.status as ApplicationStatus,
          application_data: app.application_data,
          institution_notes: (app as any).institution_notes || '',
          vacancy: vacancy ? {
            title: vacancy.title,
            institution: vacancy.institution,
            location: vacancy.location,
          } : undefined,
          professional: profile ? {
            first_name: profile.first_name,
            last_name: profile.last_name,
            specialty: profile.specialty || undefined,
            profile_image: profile.profile_image || undefined,
            email: profile.email || undefined,
          } : undefined,
          applicantName: profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown',
          applicantEmail: profile?.email || appDataParsed?.email || '',
          vacancyTitle: vacancy?.title || 'Unknown Position',
          appliedDate: new Date(app.application_date).toLocaleDateString(),
          coverLetter: appDataParsed?.message || appDataParsed?.coverLetter || '',
        };
      });

      setApplications(enrichedApps);
      setError('');
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      setError(err.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return { applications, loading, error, refreshApplications: fetchApplications };
};
