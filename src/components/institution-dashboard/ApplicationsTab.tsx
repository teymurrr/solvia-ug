
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/vacancy/utils';

type Application = {
  id: string;
  status: string;
  application_date: string;
  vacancy_id: string;
  user_id: string;
  application_data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    coverLetter?: string;
    cvFileName?: string;
  };
  vacancy?: {
    title: string;
    department: string;
  };
  professionalProfile?: {
    first_name: string;
    last_name: string;
    specialty: string;
    profile_image?: string;
  };
};

const ApplicationsTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [selectedVacancy, setSelectedVacancy] = useState<string>('all');
  
  useEffect(() => {
    const fetchApplications = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        // First get all vacancies owned by this institution
        const { data: institutionVacancies, error: vacancyError } = await supabase
          .from('vacancies')
          .select('id, title, department')
          .eq('institution_id', user.id);
          
        if (vacancyError) throw vacancyError;
        
        setVacancies(institutionVacancies || []);
        
        if (institutionVacancies?.length === 0) {
          setApplications([]);
          setLoading(false);
          return;
        }
        
        // Get vacancy IDs
        const vacancyIds = institutionVacancies.map(v => v.id);
        
        // Get applications for these vacancies
        const { data: applicationData, error: applicationError } = await supabase
          .from('applied_vacancies')
          .select(`
            id, 
            status, 
            application_date, 
            vacancy_id, 
            user_id, 
            application_data,
            vacancy:vacancies(title, department)
          `)
          .in('vacancy_id', vacancyIds)
          .order('application_date', { ascending: false });
          
        if (applicationError) throw applicationError;
        
        // Get professional profiles for these applications
        const userIds = applicationData.map(app => app.user_id);
        
        const { data: profileData, error: profileError } = await supabase
          .from('professional_profiles')
          .select('id, first_name, last_name, specialty, profile_image')
          .in('id', userIds);
          
        if (profileError) {
          console.warn("Could not fetch professional profiles:", profileError);
        }
        
        // Combine the data
        const combinedApplications = applicationData.map(app => {
          const profile = profileData?.find(p => p.id === app.user_id);
          return {
            ...app,
            professionalProfile: profile
          };
        });
        
        setApplications(combinedApplications);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast({
          title: "Error",
          description: "Failed to load application data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, [user, toast]);
  
  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('applied_vacancies')
        .update({ status: newStatus })
        .eq('id', applicationId);
        
      if (error) throw error;
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: newStatus } 
            : app
        )
      );
      
      toast({
        title: "Status updated",
        description: `Application status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating application status:", error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    }
  };
  
  const filteredApplications = selectedVacancy === 'all'
    ? applications
    : applications.filter(app => app.vacancy_id === selectedVacancy);
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'approved':
      case 'accepted':
        return 'bg-green-500 text-white';
      case 'rejected':
        return 'bg-red-500 text-white';
      case 'interview':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-sm" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  
  if (vacancies.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Vacancies Posted</CardTitle>
          <CardDescription>
            You haven't posted any job vacancies yet. Create a vacancy to start receiving applications.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  if (applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Applications Yet</CardTitle>
          <CardDescription>
            You haven't received any applications for your vacancies yet.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Applications</h2>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter by vacancy:</span>
          <Select 
            value={selectedVacancy} 
            onValueChange={(value) => setSelectedVacancy(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Vacancies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vacancies</SelectItem>
              {vacancies.map((vacancy) => (
                <SelectItem key={vacancy.id} value={vacancy.id}>
                  {vacancy.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No applications match your filter criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((application) => {
                const fullName = application.professionalProfile
                  ? `${application.professionalProfile.first_name} ${application.professionalProfile.last_name}`
                  : `${application.application_data?.firstName || ''} ${application.application_data?.lastName || ''}`;
                  
                const appliedDate = formatDate(application.application_date);
                
                return (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">
                      {fullName}
                      {application.professionalProfile?.specialty && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {application.professionalProfile.specialty}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {application.vacancy?.title}
                      <div className="text-xs text-muted-foreground mt-1">
                        {application.vacancy?.department}
                      </div>
                    </TableCell>
                    <TableCell>{appliedDate}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Select 
                        value={application.status}
                        onValueChange={(value) => updateApplicationStatus(application.id, value)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="interview">Interview</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ApplicationsTab;
