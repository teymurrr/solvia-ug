
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { 
  Clock, Eye, CheckCircle2, XCircle, UserCircle, 
  ChevronDown, Mail, FileText, RefreshCw, StickyNote,
  ArrowRight, Calendar, Briefcase, MessageSquare
} from 'lucide-react';
import { Application, ApplicationStatus } from '@/hooks/applications/types';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface KanbanApplicationsProps {
  applications: Application[];
  loading?: boolean;
  error?: string | null;
  onUpdateStatus: (applicationId: string, status: ApplicationStatus) => Promise<boolean>;
  refreshApplications?: () => void;
}

const KANBAN_COLUMNS: { key: ApplicationStatus; icon: React.ReactNode; colorClass: string }[] = [
  { key: 'pending', icon: <Clock className="h-4 w-4" />, colorClass: 'border-t-yellow-400' },
  { key: 'reviewing', icon: <Eye className="h-4 w-4" />, colorClass: 'border-t-blue-400' },
  { key: 'interview', icon: <Calendar className="h-4 w-4" />, colorClass: 'border-t-purple-400' },
  { key: 'accepted', icon: <CheckCircle2 className="h-4 w-4" />, colorClass: 'border-t-green-400' },
  { key: 'rejected', icon: <XCircle className="h-4 w-4" />, colorClass: 'border-t-red-400' },
];

const KanbanApplications: React.FC<KanbanApplicationsProps> = ({
  applications,
  loading = false,
  error = null,
  onUpdateStatus,
  refreshApplications,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const appTexts = t?.dashboard?.applications || {};
  const instTexts = t?.dashboard?.institution || {};

  const getStatusLabel = (status: ApplicationStatus): string => {
    const labels: Record<ApplicationStatus, string> = {
      pending: appTexts?.pending || 'Pending',
      reviewing: appTexts?.reviewing || 'In Review',
      interview: appTexts?.interview || 'Interview',
      offered: appTexts?.offered || 'Offered',
      accepted: appTexts?.accepted || 'Accepted',
      rejected: appTexts?.rejected || 'Rejected',
      withdrawn: appTexts?.withdrawn || 'Withdrawn',
    };
    return labels[status] || status;
  };

  const columnApps = useMemo(() => {
    const grouped: Record<string, Application[]> = {};
    KANBAN_COLUMNS.forEach(col => { grouped[col.key] = []; });
    
    applications.forEach(app => {
      const status = app.status as ApplicationStatus;
      if (grouped[status]) {
        grouped[status].push(app);
      } else {
        // Default unknown statuses to pending
        grouped['pending']?.push(app);
      }
    });
    return grouped;
  }, [applications]);

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name.split(' ').map(p => p[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleStatusUpdate = async (appId: string, newStatus: ApplicationStatus) => {
    setIsUpdating(true);
    const success = await onUpdateStatus(appId, newStatus);
    if (success && selectedApp?.id === appId) {
      setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null);
    }
    setIsUpdating(false);
  };

  const handleSaveNotes = async () => {
    if (!selectedApp) return;
    setSavingNotes(true);
    try {
      const { error } = await supabase
        .from('applied_vacancies')
        .update({ institution_notes: notes } as any)
        .eq('id', selectedApp.id);

      if (error) throw error;
      
      toast({
        title: t?.common?.success || 'Saved',
        description: instTexts?.notesSaved || 'Notes saved successfully',
      });
      
      // Update local state
      setSelectedApp(prev => prev ? { ...prev, institution_notes: notes } : null);
    } catch (err: any) {
      toast({
        title: t?.common?.error || 'Error',
        description: err.message || 'Failed to save notes',
        variant: 'destructive',
      });
    } finally {
      setSavingNotes(false);
    }
  };

  const openDetails = (app: Application) => {
    setSelectedApp(app);
    setNotes(app.institution_notes || '');
    setIsDetailsOpen(true);
  };

  const getNextStatuses = (current: ApplicationStatus): ApplicationStatus[] => {
    const transitions: Record<ApplicationStatus, ApplicationStatus[]> = {
      pending: ['reviewing', 'rejected'],
      reviewing: ['interview', 'accepted', 'rejected'],
      interview: ['accepted', 'rejected'],
      offered: ['accepted', 'rejected'],
      accepted: [],
      rejected: ['pending'],
      withdrawn: ['pending'],
    };
    return transitions[current] || [];
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-3 text-muted-foreground">{t?.dashboard?.loading || 'Loading...'}</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center p-8">
          <p className="text-destructive">{error}</p>
          {refreshApplications && (
            <Button variant="outline" className="mt-4" onClick={refreshApplications}>
              {t?.common?.tryAgain || 'Try Again'}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{instTexts?.applicationsTitle || appTexts?.applicationDetails || 'Applications'}</CardTitle>
            <CardDescription>
              {applications.length} {instTexts?.totalApplications || 'total applications'}
            </CardDescription>
          </div>
          {refreshApplications && (
            <Button variant="outline" size="icon" onClick={refreshApplications}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">{t?.dashboard?.noApplications || 'No applications yet'}</h3>
              <p className="text-muted-foreground mt-1">
                {instTexts?.noApplicationsDesc || 'Applications will appear here when candidates apply'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {KANBAN_COLUMNS.map(col => (
                <div key={col.key} className={`rounded-lg border-t-4 ${col.colorClass} bg-muted/30 p-3`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {col.icon}
                      <span className="font-medium text-sm">{getStatusLabel(col.key)}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {columnApps[col.key]?.length || 0}
                    </Badge>
                  </div>
                  
                  <ScrollArea className="max-h-[500px]">
                    <div className="space-y-2">
                      {columnApps[col.key]?.map(app => {
                        const fullName = app.professional 
                          ? `${app.professional.first_name} ${app.professional.last_name}` 
                          : app.applicantName || 'Unknown';
                        const photoUrl = app.professional?.profile_image || app.applicantPhoto;

                        return (
                          <div
                            key={app.id}
                            className="bg-background rounded-md p-3 shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => openDetails(app)}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={photoUrl} alt={fullName} />
                                <AvatarFallback className="text-xs">{getInitials(fullName)}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-sm truncate">{fullName}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {app.professional?.specialty || ''}
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground truncate mb-1">
                              <Briefcase className="inline h-3 w-3 mr-1" />
                              {app.vacancy?.title || app.vacancyTitle || ''}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              <Calendar className="inline h-3 w-3 mr-1" />
                              {app.application_date}
                            </p>
                            {app.institution_notes && (
                              <div className="mt-1">
                                <StickyNote className="inline h-3 w-3 mr-1 text-yellow-500" />
                                <span className="text-xs text-muted-foreground italic truncate">
                                  {app.institution_notes.substring(0, 40)}...
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {(!columnApps[col.key] || columnApps[col.key].length === 0) && (
                        <p className="text-xs text-muted-foreground text-center py-4 italic">
                          {t?.common?.empty || 'Empty'}
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Detail Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedApp && (() => {
            const fullName = selectedApp.professional
              ? `${selectedApp.professional.first_name} ${selectedApp.professional.last_name}`
              : selectedApp.applicantName || 'Unknown';
            const photoUrl = selectedApp.professional?.profile_image || selectedApp.applicantPhoto;
            const nextStatuses = getNextStatuses(selectedApp.status);

            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5" />
                    {appTexts?.applicationDetails || 'Application Details'}
                  </DialogTitle>
                  <DialogDescription>
                    {appTexts?.reviewApplication || 'Review application for'} {selectedApp.vacancy?.title || selectedApp.vacancyTitle}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6">
                  {/* Applicant info */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={photoUrl} alt={fullName} />
                      <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{fullName}</h3>
                      {selectedApp.professional?.specialty && (
                        <p className="text-sm text-muted-foreground">{selectedApp.professional.specialty}</p>
                      )}
                      <Badge variant="outline" className="mt-1">
                        {getStatusLabel(selectedApp.status)}
                      </Badge>
                    </div>
                  </div>

                  {/* Contact info */}
                  <div className="grid gap-2">
                    {(selectedApp.applicantEmail || selectedApp.professional?.email) && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${selectedApp.applicantEmail || selectedApp.professional?.email}`} className="text-primary hover:underline">
                          {selectedApp.applicantEmail || selectedApp.professional?.email}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{appTexts?.appliedOn || 'Applied'}: {selectedApp.application_date}</span>
                    </div>
                  </div>

                  {/* Position */}
                  <div>
                    <h4 className="font-medium mb-1 text-sm">{appTexts?.appliedFor || 'Applied for'}</h4>
                    <p className="text-sm bg-muted p-2 rounded">{selectedApp.vacancy?.title || selectedApp.vacancyTitle}</p>
                  </div>

                  {/* Cover letter / message */}
                  {selectedApp.coverLetter && (
                    <div>
                      <h4 className="font-medium mb-1 text-sm flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {appTexts?.coverLetter || 'Message'}
                      </h4>
                      <div className="text-sm bg-muted p-3 rounded max-h-32 overflow-y-auto">
                        {selectedApp.coverLetter.split('\n').map((p, i) => (
                          <p key={i} className="mb-1">{p}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Institution notes */}
                  <div>
                    <h4 className="font-medium mb-1 text-sm flex items-center gap-1">
                      <StickyNote className="h-4 w-4" />
                      {instTexts?.internalNotes || 'Internal Notes'}
                    </h4>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={instTexts?.notesPlaceholder || 'Add internal notes about this applicant...'}
                      className="min-h-[80px]"
                    />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2"
                      onClick={handleSaveNotes}
                      disabled={savingNotes || notes === (selectedApp.institution_notes || '')}
                    >
                      {savingNotes ? (t?.dashboard?.loading || 'Saving...') : (t?.dashboard?.saveProfile || 'Save')}
                    </Button>
                  </div>

                  {/* Status actions */}
                  {nextStatuses.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 text-sm">{appTexts?.updateStatus || 'Update Status'}</h4>
                      <div className="flex flex-wrap gap-2">
                        {nextStatuses.map(status => (
                          <Button
                            key={status}
                            size="sm"
                            variant={status === 'accepted' ? 'default' : status === 'rejected' ? 'destructive' : 'outline'}
                            onClick={() => handleStatusUpdate(selectedApp.id, status)}
                            disabled={isUpdating}
                            className="flex items-center gap-1"
                          >
                            <ArrowRight className="h-3 w-3" />
                            {getStatusLabel(status)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default KanbanApplications;
