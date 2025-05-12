
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Mail, ExternalLink, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getInitials } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/hooks/useLanguage';

// Define proper interfaces for application objects
interface Applicant {
  id: string;
  first_name: string;
  last_name: string;
  profession?: string;
  specialty?: string;
  profile_image?: string;
}

interface Application {
  id: string;
  vacancy_id: string;
  vacancy_title: string;
  status: 'pending' | 'accepted' | 'rejected';
  application_date: string;
  applicant: Applicant;
  application_data?: any;
}

const ApplicationsTab = () => {
  const { session, user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Fetch applications for the institution
  useEffect(() => {
    const fetchApplications = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        
        // Get vacancies for this institution
        const { data: vacancies, error: vacanciesError } = await supabase
          .from('vacancies')
          .select('id, title')
          .eq('institution_id', user.id);
          
        if (vacanciesError) throw vacanciesError;
        
        if (!vacancies || vacancies.length === 0) {
          setApplications([]);
          return;
        }
        
        // Get all applications for these vacancies
        const vacancyIds = vacancies.map(v => v.id);
        
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applied_vacancies')
          .select(`
            id,
            vacancy_id,
            user_id,
            status,
            application_date,
            application_data
          `)
          .in('vacancy_id', vacancyIds);
          
        if (applicationsError) throw applicationsError;
        
        if (!applicationsData || applicationsData.length === 0) {
          setApplications([]);
          setLoading(false);
          return;
        }
        
        // Get professional profiles for each applicant
        // Create a map of vacancy titles
        const vacancyTitleMap = vacancies.reduce((map: Record<string, string>, vacancy) => {
          map[vacancy.id] = vacancy.title;
          return map;
        }, {});
        
        // Get user profiles
        const userIds = [...new Set(applicationsData.map(app => app.user_id))];
        
        const { data: profiles, error: profilesError } = await supabase
          .from('professional_profiles')
          .select(`
            id,
            first_name,
            last_name,
            profession,
            specialty,
            profile_image
          `)
          .in('id', userIds);
          
        if (profilesError) throw profilesError;
        
        // Create a map of profiles
        const profileMap = profiles ? profiles.reduce((map: Record<string, any>, profile) => {
          map[profile.id] = profile;
          return map;
        }, {}) : {};
        
        // Combine all data
        const formattedApplications = applicationsData.map(app => {
          // Explicitly define the return type to avoid deep instantiation
          const formattedApp: Application = {
            id: app.id,
            vacancy_id: app.vacancy_id,
            vacancy_title: vacancyTitleMap[app.vacancy_id] || 'Unknown Vacancy',
            status: app.status as 'pending' | 'accepted' | 'rejected',
            application_date: app.application_date,
            applicant: profileMap[app.user_id] || { 
              id: app.user_id,
              first_name: 'Unknown',
              last_name: 'Applicant'
            },
            application_data: app.application_data
          };
          return formattedApp;
        });
        
        setApplications(formattedApplications);
        
      } catch (error) {
        console.error('Error loading applications:', error);
        toast({
          title: t?.common?.error || 'Error',
          description: t?.dashboard?.applications?.errorLoading || 'Could not load applications',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, [user, toast, t]);

  // Filter applications based on active tab
  const filteredApplications = applications.filter(app => {
    if (activeTab === 'all') return true;
    return app.status === activeTab;
  });

  // Handle application status update
  const updateApplicationStatus = async (applicationId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('applied_vacancies')
        .update({ status: newStatus })
        .eq('id', applicationId);
        
      if (error) throw error;
      
      // Update local state
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
      
      toast({
        title: 'Status Updated',
        description: `Application has been ${newStatus}`,
      });
      
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: 'Error',
        description: 'Could not update application status',
        variant: 'destructive',
      });
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1"><Clock className="h-3 w-3" /> {t?.dashboard?.applications?.pending || 'Pending'}</Badge>;
      case 'accepted':
        return <Badge className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> {t?.dashboard?.applications?.accepted || 'Accepted'}</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"><XCircle className="h-3 w-3" /> {t?.dashboard?.applications?.rejected || 'Rejected'}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-4">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all"><Skeleton className="h-4 w-16" /></TabsTrigger>
            <TabsTrigger value="pending"><Skeleton className="h-4 w-16" /></TabsTrigger>
            <TabsTrigger value="accepted"><Skeleton className="h-4 w-16" /></TabsTrigger>
            <TabsTrigger value="rejected"><Skeleton className="h-4 w-16" /></TabsTrigger>
          </TabsList>
        </Tabs>
        
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
              <div className="p-4">
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-3/4 mb-3" />
                <div className="flex justify-end mt-4 space-x-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // No applications yet
  if (applications.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-gray-50">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          {t?.dashboard?.applications?.noApplications || "No applications yet"}
        </h3>
        <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
          {t?.dashboard?.applications?.noApplicationsDesc || "You haven't received any applications for your vacancies yet."}
        </p>
      </div>
    );
  }

  // Main content
  return (
    <div className="space-y-4">
      <Tabs 
        defaultValue="all" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="all">{t?.dashboard?.applications?.all || "All"} ({applications.length})</TabsTrigger>
          <TabsTrigger value="pending">{t?.dashboard?.applications?.pending || "Pending"} ({applications.filter(a => a.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="accepted">{t?.dashboard?.applications?.accepted || "Accepted"} ({applications.filter(a => a.status === 'accepted').length})</TabsTrigger>
          <TabsTrigger value="rejected">{t?.dashboard?.applications?.rejected || "Rejected"} ({applications.filter(a => a.status === 'rejected').length})</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {filteredApplications.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-gray-50">
          <p>{t?.dashboard?.applications?.noApplicationsInCategory || "No applications in this category."}</p>
        </div>
      ) : (
        filteredApplications.map((application) => (
          <Card key={application.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="border-b p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      {application.applicant.profile_image ? (
                        <AvatarImage src={application.applicant.profile_image} />
                      ) : (
                        <AvatarFallback>{getInitials(`${application.applicant.first_name} ${application.applicant.last_name}`)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h4 className="text-sm font-medium">{application.applicant.first_name} {application.applicant.last_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {application.applicant.profession}{application.applicant.specialty ? `, ${application.applicant.specialty}` : ''}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(application.status)}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{application.vacancy_title}</h3>
                    <p className="text-sm text-gray-500">
                      {t?.dashboard?.applications?.appliedOn || "Applied on"}: {new Date(application.application_date).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={`mailto:${application.applicant.id}`}>
                        <Mail className="h-4 w-4 mr-1" />
                        {t?.common?.contact || "Contact"}
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={`/professionals/${application.applicant.id}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        {t?.common?.viewProfile || "View Profile"}
                      </a>
                    </Button>
                  </div>
                </div>
                
                {application.status === 'pending' && (
                  <div className="flex justify-end mt-4 space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-200 text-red-700 hover:bg-red-50"
                      onClick={() => updateApplicationStatus(application.id, 'rejected')}
                    >
                      {t?.dashboard?.applications?.reject || "Reject"}
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-green-600 text-white hover:bg-green-700"
                      onClick={() => updateApplicationStatus(application.id, 'accepted')}
                    >
                      {t?.dashboard?.applications?.accept || "Accept"}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ApplicationsTab;
