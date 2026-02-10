import React from 'react';
import { CheckCircle, XCircle, Clock, MessageSquare, Inbox, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useMyMentorRequests, useIncomingMentorRequests, useUpdateMentorRequest, useMyMentorProfile } from '@/hooks/useMentors';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const statusConfig: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  pending: { label: 'Pending', icon: <Clock className="h-3.5 w-3.5" />, className: 'bg-yellow-500/10 text-yellow-700 border-yellow-200' },
  accepted: { label: 'Accepted', icon: <CheckCircle className="h-3.5 w-3.5" />, className: 'bg-green-500/10 text-green-700 border-green-200' },
  declined: { label: 'Declined', icon: <XCircle className="h-3.5 w-3.5" />, className: 'bg-red-500/10 text-red-700 border-red-200' },
  cancelled: { label: 'Cancelled', icon: <XCircle className="h-3.5 w-3.5" />, className: 'bg-muted text-muted-foreground' },
};

const MentorRequestsPanel: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { data: myMentorProfile } = useMyMentorProfile();
  const { data: sentRequests, isLoading: sentLoading } = useMyMentorRequests();
  const { data: incomingRequests, isLoading: incomingLoading } = useIncomingMentorRequests();
  const updateRequest = useUpdateMentorRequest();

  if (!isLoggedIn) return null;

  const isMentor = !!myMentorProfile;
  const pendingIncoming = (incomingRequests || []).filter(r => r.status === 'pending').length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          Mentor Requests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={isMentor && pendingIncoming > 0 ? 'incoming' : 'sent'}>
          <TabsList className="w-full mb-3">
            <TabsTrigger value="sent" className="flex-1 gap-1.5 text-xs">
              <Send className="h-3.5 w-3.5" />
              Sent ({(sentRequests || []).length})
            </TabsTrigger>
            {isMentor && (
              <TabsTrigger value="incoming" className="flex-1 gap-1.5 text-xs">
                <Inbox className="h-3.5 w-3.5" />
                Incoming
                {pendingIncoming > 0 && (
                  <span className="ml-1 bg-primary text-primary-foreground text-[10px] rounded-full px-1.5 py-0.5 font-bold">
                    {pendingIncoming}
                  </span>
                )}
              </TabsTrigger>
            )}
          </TabsList>

          {/* Sent requests (mentee view) */}
          <TabsContent value="sent" className="mt-0">
            {sentLoading ? (
              <div className="space-y-2">
                {[1, 2].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
              </div>
            ) : !(sentRequests || []).length ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No requests sent yet. Browse the mentor directory to find a mentor!
              </p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {(sentRequests || []).map((req: any) => {
                  const status = statusConfig[req.status] || statusConfig.pending;
                  return (
                    <div key={req.id} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage src={req.mentorAuthor?.profile_image || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {req.mentorAuthor?.first_name?.[0]}{req.mentorAuthor?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-foreground truncate">
                            {req.mentorAuthor?.first_name} {req.mentorAuthor?.last_name}
                          </p>
                          <Badge variant="outline" className={`text-xs shrink-0 ${status.className}`}>
                            {status.icon}
                            <span className="ml-1">{status.label}</span>
                          </Badge>
                        </div>
                        {req.mentorAuthor?.specialty && (
                          <p className="text-xs text-muted-foreground">{req.mentorAuthor.specialty}</p>
                        )}
                        {req.message && (
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-1 italic">"{req.message}"</p>
                        )}
                        <p className="text-[11px] text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(req.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Incoming requests (mentor view) */}
          {isMentor && (
            <TabsContent value="incoming" className="mt-0">
              {incomingLoading ? (
                <div className="space-y-2">
                  {[1, 2].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
                </div>
              ) : !(incomingRequests || []).length ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No incoming requests yet.
                </p>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {(incomingRequests || []).map((req: any) => {
                    const status = statusConfig[req.status] || statusConfig.pending;
                    const isPending = req.status === 'pending';
                    return (
                      <div key={req.id} className="p-3 rounded-lg border border-border bg-card">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-9 w-9 shrink-0">
                            <AvatarImage src={req.menteeAuthor?.profile_image || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {req.menteeAuthor?.first_name?.[0]}{req.menteeAuthor?.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium text-foreground truncate">
                                {req.menteeAuthor?.first_name} {req.menteeAuthor?.last_name}
                              </p>
                              {!isPending && (
                                <Badge variant="outline" className={`text-xs shrink-0 ${status.className}`}>
                                  {status.icon}
                                  <span className="ml-1">{status.label}</span>
                                </Badge>
                              )}
                            </div>
                            {req.menteeAuthor?.specialty && (
                              <p className="text-xs text-muted-foreground">{req.menteeAuthor.specialty}</p>
                            )}
                            {req.message && (
                              <p className="text-xs text-muted-foreground mt-1 italic">"{req.message}"</p>
                            )}
                            <p className="text-[11px] text-muted-foreground mt-1">
                              {formatDistanceToNow(new Date(req.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        {isPending && (
                          <div className="flex gap-2 mt-3 ml-12">
                            <Button
                              size="sm"
                              onClick={() => updateRequest.mutate({ requestId: req.id, status: 'accepted' })}
                              disabled={updateRequest.isPending}
                            >
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateRequest.mutate({ requestId: req.id, status: 'declined' })}
                              disabled={updateRequest.isPending}
                            >
                              <XCircle className="h-3.5 w-3.5 mr-1" />
                              Decline
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MentorRequestsPanel;
