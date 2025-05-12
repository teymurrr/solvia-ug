
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { FileText, Mail, ExternalLink, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getInitials } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/hooks/useLanguage';

// Define Application type
type Application = {
  id: string;
  user_id: string;
  vacancy_id: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  created_at: string;
  // Join data
  vacancy?: {
    title: string;
    institution: string;
    department: string;
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar_url?: string;
    profession?: string;
    specialty?: string;
  };
  // UI state
  isExpanded?: boolean;
};

const ApplicationsTab: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // TODO: These are missing in the translations, using fallbacks for now
  const applicationLabels = {
    title: 'Applications',
    noApplications: 'No applications found',
    noApplicationsDesc: 'You will see applications to your vacancies here.',
    loading: 'Loading applications...',
    filter: {
      all: 'All Applications',
      pending: 'Pending',
      reviewed: 'Reviewed',
      shortlisted: 'Shortlisted',
      rejected: 'Rejected',
      hired: 'Hired'
    },
    search: 'Search applications...',
    applicant: 'Applicant',
    vacancy: 'Vacancy',
    status: 'Status',
    date: 'Application Date',
    actions: 'Actions',
    viewProfile: 'View Profile',
    viewResume: 'View Resume',
    email: 'Email',
    reviewed: 'Mark as Reviewed',
    shortlist: 'Shortlist',
    reject: 'Reject',
    hire: 'Hire'
  };
  
  const fetchApplications = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // First, get vacancies from this institution
      const { data: vacancyData, error: vacancyError } = await supabase
        .from('vacancies')
        .select('id, title, institution, department')
        .eq('institution_id', user.id);
      
      if (vacancyError) throw vacancyError;
      
      if (!vacancyData || vacancyData.length === 0) {
        setApplications([]);
        return;
      }
      
      const vacancyIds = vacancyData.map(v => v.id);
      
      // Then get applications for these vacancies
      const { data, error } = await supabase
        .from('applied_vacancies')
        .select(`
          id,
          user_id,
          vacancy_id,
          status,
          created_at,
          vacancy:vacancies(title, institution, department),
          user:user_id(id, firstName, lastName, email, avatar_url, profession, specialty)
        `)
        .in('vacancy_id', vacancyIds)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Format the data to match our Application type
      const formattedApplications: Application[] = data.map((app) => ({
        id: app.id,
        user_id: app.user_id,
        vacancy_id: app.vacancy_id,
        status: app.status || 'pending',
        created_at: app.created_at,
        vacancy: app.vacancy,
        user: app.user,
        isExpanded: false
      }));
      
      setApplications(formattedApplications);
      console.log("Applications loaded:", formattedApplications);
      
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error loading applications",
        description: "There was a problem loading your applications.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchApplications();
  }, [user?.id]);
  
  const updateApplicationStatus = async (applicationId: string, newStatus: Application['status']) => {
    try {
      const { data, error } = await supabase
        .from('applied_vacancies')
        .update({ status: newStatus })
        .eq('id', applicationId)
        .select()
        .single();
        
      if (error) throw error;
      
      setApplications(apps => 
        apps.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      
      toast({
        title: "Status updated",
        description: `Application marked as ${newStatus}`,
      });
      
      return true;
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Error updating status",
        description: "There was a problem updating the application status.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const toggleExpanded = (applicationId: string) => {
    setApplications(apps => 
      apps.map(app => 
        app.id === applicationId ? { ...app, isExpanded: !app.isExpanded } : app
      )
    );
  };
  
  const getStatusBadgeProps = (status: Application['status']) => {
    switch(status) {
      case 'pending':
        return { className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200", icon: <Clock className="h-3 w-3 mr-1" /> };
      case 'reviewed':
        return { className: "bg-blue-100 text-blue-800 hover:bg-blue-200", icon: <FileText className="h-3 w-3 mr-1" /> };
      case 'shortlisted':
        return { className: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200", icon: <FileText className="h-3 w-3 mr-1" /> };
      case 'rejected':
        return { className: "bg-red-100 text-red-800 hover:bg-red-200", icon: <XCircle className="h-3 w-3 mr-1" /> };
      case 'hired':
        return { className: "bg-green-100 text-green-800 hover:bg-green-200", icon: <CheckCircle className="h-3 w-3 mr-1" /> };
      default:
        return { className: "bg-gray-100 text-gray-800 hover:bg-gray-200", icon: <Clock className="h-3 w-3 mr-1" /> };
    }
  };
  
  // Filter applications based on search term and status filter
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      searchTerm === '' || 
      app.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.vacancy?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });
  
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-36 ml-3" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">
              {applicationLabels.noApplications}
            </h3>
            <p className="mt-2 text-gray-600">
              {applicationLabels.noApplicationsDesc}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-4 md:space-y-0">
          <h2 className="text-2xl font-bold">
            {applicationLabels.title}
          </h2>
          
          <div className="flex flex-col sm:flex-row w-full md:w-auto space-y-2 sm:space-y-0 sm:space-x-2">
            <Input
              placeholder={applicationLabels.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
            />
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder={applicationLabels.filter.all} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{applicationLabels.filter.all}</SelectItem>
                <SelectItem value="pending">{applicationLabels.filter.pending}</SelectItem>
                <SelectItem value="reviewed">{applicationLabels.filter.reviewed}</SelectItem>
                <SelectItem value="shortlisted">{applicationLabels.filter.shortlisted}</SelectItem>
                <SelectItem value="rejected">{applicationLabels.filter.rejected}</SelectItem>
                <SelectItem value="hired">{applicationLabels.filter.hired}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{applicationLabels.applicant}</TableHead>
                <TableHead>{applicationLabels.vacancy}</TableHead>
                <TableHead>{applicationLabels.status}</TableHead>
                <TableHead>{applicationLabels.date}</TableHead>
                <TableHead className="text-right">{applicationLabels.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((application) => (
                <React.Fragment key={application.id}>
                  <TableRow 
                    className="cursor-pointer" 
                    onClick={() => toggleExpanded(application.id)}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={application.user?.avatar_url} />
                          <AvatarFallback>
                            {application.user ? getInitials(`${application.user.firstName} ${application.user.lastName}`) : '??'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {application.user?.firstName} {application.user?.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {application.user?.profession || application.user?.specialty || "Professional"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{application.vacancy?.title}</p>
                      <p className="text-sm text-gray-500">
                        {application.vacancy?.department}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeProps(application.status).className}>
                        {getStatusBadgeProps(application.status).icon}
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(application.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`/professional-profile/${application.user?.id}`, '_blank');
                        }}
                      >
                        {applicationLabels.viewProfile} <ExternalLink className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  {application.isExpanded && (
                    <TableRow>
                      <TableCell colSpan={5} className="bg-gray-50 p-4">
                        <div className="flex flex-col space-y-4">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.location.href = `mailto:${application.user?.email}`}
                            >
                              <Mail className="mr-1 h-4 w-4" />
                              {applicationLabels.email}
                            </Button>
                            
                            {/* Status update buttons */}
                            {application.status === 'pending' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateApplicationStatus(application.id, 'reviewed')}
                              >
                                <FileText className="mr-1 h-4 w-4" />
                                {applicationLabels.reviewed}
                              </Button>
                            )}
                            
                            {(application.status === 'pending' || application.status === 'reviewed') && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-indigo-200"
                                onClick={() => updateApplicationStatus(application.id, 'shortlisted')}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                {applicationLabels.shortlist}
                              </Button>
                            )}
                            
                            {application.status !== 'rejected' && application.status !== 'hired' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
                                onClick={() => updateApplicationStatus(application.id, 'rejected')}
                              >
                                <XCircle className="mr-1 h-4 w-4" />
                                {applicationLabels.reject}
                              </Button>
                            )}
                            
                            {application.status === 'shortlisted' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
                                onClick={() => updateApplicationStatus(application.id, 'hired')}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                {applicationLabels.hire}
                              </Button>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationsTab;
