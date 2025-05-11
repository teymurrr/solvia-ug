import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from '@/hooks/use-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { MoreVertical, CheckCircle, XCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Fix the type issue for application_data
interface Application {
  id: string;
  status: string;
  application_date: string;
  vacancy_id: string;
  user_id: string;
  application_data?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    coverLetter?: string;
    cvFileName?: string;
  };
  vacancy: {
    id: string;
    title: string;
    institution: string;
    location: string;
    job_type: string;
  };
  professionalProfile?: {
    id: string;
    first_name: string;
    last_name: string;
    specialty: string;
    profile_image: string;
  };
}

const ApplicationsTab: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  // Update the type handling when setting applications
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const { data: applicationsData, error } = await supabase
          .from('applied_vacancies')
          .select(`
            *,
            vacancy:vacancies(*),
            professionalProfile:profiles(id, first_name, last_name, specialty, profile_image)
          `)
          .eq('status', 'pending');

        if (error) throw error;
        
        if (applicationsData) {
          // Ensure the application_data is properly typed
          const typedApplications = applicationsData.map(app => ({
            ...app,
            application_data: app.application_data as Application['application_data']
          }));
          
          setApplications(typedApplications as Application[]);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast({
          title: "Error",
          description: "Failed to load applications",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [supabase, toast]);

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('applied_vacancies')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      // Optimistically update the UI
      setApplications(currentApplications =>
        currentApplications.map(app =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      toast({
        title: "Success",
        description: `Application status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Applications</h2>
      {loading ? (
        <p>Loading applications...</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Vacancy</TableHead>
                <TableHead>Application Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    {application.professionalProfile ? (
                      <>
                        <p className="font-medium">{application.professionalProfile.first_name} {application.professionalProfile.last_name}</p>
                        <p className="text-sm text-muted-foreground">{application.professionalProfile.specialty}</p>
                      </>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    {application.vacancy ? (
                      <>
                        <p className="font-medium">{application.vacancy.title}</p>
                        <p className="text-sm text-muted-foreground">{application.vacancy.location}</p>
                      </>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>{new Date(application.application_date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(application.id, 'accepted')}>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          Accept
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(application.id, 'rejected')}>
                          <XCircle className="mr-2 h-4 w-4 text-red-500" />
                          Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ApplicationsTab;
