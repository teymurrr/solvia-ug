
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';

export interface Application {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantPhoto?: string;
  applicantEmail?: string;
  applicantPhone?: string;
  vacancyId: string;
  vacancyTitle: string;
  appliedDate: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  coverLetter?: string;
  cvFileName?: string;
}

// Define an interface for the application data JSON structure
interface ApplicationData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  coverLetter?: string;
  cvFileName?: string;
  [key: string]: any; // Allow for additional fields
}

export const useApplications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'all_statuses',
    date: 'all_time'
  });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchApplications = async () => {
    if (!user?.id) {
      setLoading(false);
      setError('Authentication required');
      return;
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
        setApplications([]);
        setFilteredApplications([]);
        setLoading(false);
        return;
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
        setApplications([]);
        setFilteredApplications([]);
        setLoading(false);
        return;
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

      setApplications(formattedApplications);
      setFilteredApplications(formattedApplications);
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      setError(err.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: 'pending' | 'reviewing' | 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('applied_vacancies')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      
      setFilteredApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      toast({
        title: 'Status updated',
        description: `Application status changed to ${newStatus}`,
      });

      return true;
    } catch (error: any) {
      console.error('Error updating application status:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update application status',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Apply filters and search
  const applyFilters = () => {
    let filtered = [...applications];
    
    // Apply status filter
    if (filters.status !== 'all_statuses') {
      filtered = filtered.filter(app => app.status === filters.status);
    }
    
    // Apply date filter
    if (filters.date !== 'all_time') {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (filters.date) {
        case 'today':
          cutoffDate.setDate(now.getDate() - 1);
          break;
        case 'this_week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'this_month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'this_year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(app => {
        const appDate = new Date(app.appliedDate);
        return appDate >= cutoffDate;
      });
    }
    
    // Apply search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.applicantName.toLowerCase().includes(query) ||
        app.vacancyTitle.toLowerCase().includes(query) ||
        (app.applicantEmail && app.applicantEmail.toLowerCase().includes(query))
      );
    }
    
    setFilteredApplications(filtered);
    
    return filtered;
  };

  // Handle search query change
  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle filter change
  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // When filters or search query changes, apply filters
  useEffect(() => {
    applyFilters();
  }, [filters, searchQuery, applications]);

  // Fetch applications on component mount or when user changes
  useEffect(() => {
    fetchApplications();
  }, [user?.id]);

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
    refreshApplications: fetchApplications,
  };
};
