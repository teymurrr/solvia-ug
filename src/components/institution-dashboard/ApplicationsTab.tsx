
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';

interface Application {
  id: string;
  vacancy_id: string;
  user_id: string;
  created_at: string;
  status: string;
  resume_url?: string;
  cover_letter?: string;
  vacancy: {
    title: string;
    department: string;
    specialty: string;
  };
  professional: {
    first_name: string;
    last_name: string;
    specialty: string;
    email: string;
  };
}

const ApplicationsTab = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchApplications = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('applications')
          .select(`
            id,
            vacancy_id,
            user_id,
            created_at,
            status,
            resume_url,
            cover_letter,
            vacancy:vacancies(title, department, specialty),
            professional:user_id(
              first_name:professional_profiles(first_name),
              last_name:professional_profiles(last_name),
              specialty:professional_profiles(specialty),
              email:auth.users(email)
            )
          `)
          .eq('institution_id', user.id);
          
        if (error) throw error;
        
        // Transform the data structure to match our Application interface
        const formattedData = data.map(app => ({
          ...app,
          professional: {
            first_name: app.professional?.first_name?.first_name || 'Unknown',
            last_name: app.professional?.last_name?.last_name || 'User',
            specialty: app.professional?.specialty?.specialty || 'Not specified',
            email: app.professional?.email?.email || 'no-email@example.com'
          }
        }));
        
        setApplications(formattedData);
      } catch (error: any) {
        console.error('Error fetching applications:', error);
        toast({
          title: 'Failed to load applications',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApplications();
  }, [user, toast]);

  const updateApplicationStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setApplications(prev => 
        prev.map(app => app.id === id ? { ...app, status } : app)
      );
      
      toast({
        title: 'Status updated',
        description: `Application status set to ${status}`,
      });
    } catch (error: any) {
      console.error('Error updating application status:', error);
      toast({
        title: 'Failed to update status',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No applications yet</h3>
        <p className="text-muted-foreground mt-2">
          When healthcare professionals apply to your vacancies, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Specialty</TableHead>
            <TableHead>Applied on</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {application.professional.first_name} {application.professional.last_name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {application.professional.specialty}
                  </div>
                </div>
              </TableCell>
              <TableCell>{application.vacancy.title}</TableCell>
              <TableCell>{application.vacancy.specialty}</TableCell>
              <TableCell>
                {new Date(application.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${
                    application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    application.status === 'approved' ? 'bg-green-100 text-green-800' :
                    application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }
                `}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
              </TableCell>
              <TableCell className="text-right space-x-2">
                {application.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-600 hover:bg-green-50"
                      onClick={() => updateApplicationStatus(application.id, 'approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => updateApplicationStatus(application.id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </>
                )}
                {application.resume_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(application.resume_url, '_blank')}
                  >
                    View Resume
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicationsTab;
