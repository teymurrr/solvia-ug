
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Briefcase, Calendar, Mail, MapPin, User, FileText, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';

const STATUS_OPTIONS = ['pending', 'reviewed', 'shortlisted', 'interview', 'accepted', 'rejected'] as const;

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
  shortlisted: 'bg-purple-100 text-purple-800 border-purple-200',
  interview: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  accepted: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

const AdminApplications: React.FC = () => {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const { data: applications, isLoading } = useQuery({
    queryKey: ['admin-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applied_vacancies')
        .select(`
          *,
          vacancy:vacancies(title, institution, location, department),
          profile:user_id(first_name, last_name, email, specialty, location, language_level, doctor_type, study_country, profession)
        `)
        .order('application_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('applied_vacancies')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
      toast({ title: 'Status updated', duration: 2000 });
    },
    onError: () => {
      toast({ title: 'Failed to update status', variant: 'destructive' });
    },
  });

  const filtered = applications?.filter(
    (app) => filterStatus === 'all' || app.status === filterStatus
  );

  const getAppData = (app: any) => {
    try {
      return typeof app.application_data === 'string'
        ? JSON.parse(app.application_data)
        : app.application_data;
    } catch {
      return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin/users"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Vacancy Applications</h1>
            <p className="text-sm text-muted-foreground">
              {applications?.length || 0} total applications
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm font-medium text-muted-foreground">Filter:</span>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filterStatus !== 'all' && (
            <Badge variant="secondary">{filtered?.length} results</Badge>
          )}
        </div>

        {/* Applications list */}
        {!filtered?.length ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No applications found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((app) => {
              const profile = app.profile as any;
              const vacancy = app.vacancy as any;
              const appData = getAppData(app);

              return (
                <Card key={app.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Applicant info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="font-semibold text-foreground truncate">
                            {profile?.first_name} {profile?.last_name}
                          </span>
                          {profile?.specialty && (
                            <Badge variant="outline" className="text-xs shrink-0">
                              {profile.specialty}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Briefcase className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">
                            {vacancy?.title} — {vacancy?.institution}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {profile?.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {profile.email}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(app.application_date), { addSuffix: true })}
                          </span>
                        </div>
                      </div>

                      {/* Status + Actions */}
                      <div className="flex items-center gap-3 shrink-0">
                        <Select
                          value={app.status}
                          onValueChange={(val) => updateStatus.mutate({ id: app.id, status: val })}
                        >
                          <SelectTrigger className={`w-[140px] text-xs font-medium ${statusColors[app.status] || ''}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((s) => (
                              <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedApp(app)}>
                              <FileText className="h-4 w-4 mr-1" /> Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Application Details</DialogTitle>
                            </DialogHeader>
                            {selectedApp && (() => {
                              const sp = selectedApp.profile as any;
                              const sv = selectedApp.vacancy as any;
                              const sd = getAppData(selectedApp);
                              return (
                                <div className="space-y-4">
                                  {/* Applicant */}
                                  <div>
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Applicant</h3>
                                    <div className="space-y-1 text-sm">
                                      <p><strong>Name:</strong> {sp?.first_name} {sp?.last_name}</p>
                                      {sp?.email && <p><strong>Email:</strong> {sp.email}</p>}
                                      {sp?.specialty && <p><strong>Specialty:</strong> {sp.specialty}</p>}
                                      {sp?.profession && <p><strong>Profession:</strong> {sp.profession}</p>}
                                      {sp?.doctor_type && <p><strong>Type:</strong> {sp.doctor_type}</p>}
                                      {sp?.language_level && <p><strong>German Level:</strong> {sp.language_level}</p>}
                                      {sp?.location && <p><strong>Location:</strong> {sp.location}</p>}
                                      {sp?.study_country && <p><strong>Study Country:</strong> {sp.study_country}</p>}
                                    </div>
                                  </div>
                                  <Separator />
                                  {/* Vacancy */}
                                  <div>
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Vacancy</h3>
                                    <div className="space-y-1 text-sm">
                                      <p><strong>Title:</strong> {sv?.title}</p>
                                      <p><strong>Institution:</strong> {sv?.institution}</p>
                                      {sv?.location && <p><strong>Location:</strong> {sv.location}</p>}
                                      {sv?.department && <p><strong>Department:</strong> {sv.department}</p>}
                                    </div>
                                  </div>
                                  <Separator />
                                  {/* Application data / message */}
                                  <div>
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Application Message</h3>
                                    {sd ? (
                                      <div className="space-y-2 text-sm">
                                        {sd.message && (
                                          <div className="bg-muted rounded-lg p-3">
                                            <p className="whitespace-pre-wrap">{sd.message}</p>
                                          </div>
                                        )}
                                        {sd.coverLetter && (
                                          <div>
                                            <p className="font-medium mb-1">Cover Letter:</p>
                                            <div className="bg-muted rounded-lg p-3">
                                              <p className="whitespace-pre-wrap">{sd.coverLetter}</p>
                                            </div>
                                          </div>
                                        )}
                                        {/* Show any other fields */}
                                        {Object.entries(sd)
                                          .filter(([k]) => !['message', 'coverLetter'].includes(k))
                                          .map(([key, val]) => (
                                            <p key={key}>
                                              <strong className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</strong>{' '}
                                              {String(val)}
                                            </p>
                                          ))}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-muted-foreground italic">No message provided</p>
                                    )}
                                  </div>
                                  <Separator />
                                  {/* Meta */}
                                  <div className="text-xs text-muted-foreground space-y-1">
                                    <p>Applied: {format(new Date(selectedApp.application_date), 'PPpp')}</p>
                                    <p>Last updated: {format(new Date(selectedApp.updated_at), 'PPpp')}</p>
                                  </div>
                                </div>
                              );
                            })()}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApplications;
