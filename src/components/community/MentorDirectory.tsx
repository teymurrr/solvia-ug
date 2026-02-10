
import React, { useState } from 'react';
import { Users, Star, Globe, MessageSquare, CheckCircle, Clock, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useMentorDirectory, useSendMentorRequest, EXPERTISE_OPTIONS, MentorProfile } from '@/hooks/useMentors';
import { useAuth } from '@/contexts/AuthContext';

const expertiseLabels: Record<string, string> = {
  'homologation': 'Homologation',
  'fsp-preparation': 'FSP Preparation',
  'german-language': 'German Language',
  'job-search': 'Job Search',
  'relocation': 'Relocation',
  'visa-process': 'Visa Process',
  'hospital-life': 'Hospital Life',
  'specialty-training': 'Specialty Training',
};

const availabilityConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  available: { label: 'Available', color: 'bg-green-500/10 text-green-700 border-green-200', icon: <CheckCircle className="h-3 w-3" /> },
  limited: { label: 'Limited', color: 'bg-yellow-500/10 text-yellow-700 border-yellow-200', icon: <Clock className="h-3 w-3" /> },
  unavailable: { label: 'Unavailable', color: 'bg-muted text-muted-foreground', icon: <Clock className="h-3 w-3" /> },
};

const MentorDirectory = () => {
  const [expertiseFilter, setExpertiseFilter] = useState<string>('');
  const [languageFilter, setLanguageFilter] = useState<string>('');
  const [requestMentor, setRequestMentor] = useState<MentorProfile | null>(null);
  const [requestMessage, setRequestMessage] = useState('');

  const { data: mentors, isLoading } = useMentorDirectory({
    expertise: expertiseFilter || undefined,
    language: languageFilter || undefined,
  });
  const sendRequest = useSendMentorRequest();
  const { isLoggedIn, user } = useAuth();

  const handleSendRequest = () => {
    if (!requestMentor) return;
    sendRequest.mutate(
      { mentorId: requestMentor.id, message: requestMessage || undefined },
      { onSuccess: () => { setRequestMentor(null); setRequestMessage(''); } }
    );
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={expertiseFilter} onValueChange={setExpertiseFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All expertise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All expertise</SelectItem>
              {EXPERTISE_OPTIONS.map(opt => (
                <SelectItem key={opt} value={opt}>{expertiseLabels[opt] || opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Select value={languageFilter} onValueChange={setLanguageFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All languages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All languages</SelectItem>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="German">German</SelectItem>
            <SelectItem value="Spanish">Spanish</SelectItem>
            <SelectItem value="French">French</SelectItem>
            <SelectItem value="Russian">Russian</SelectItem>
            <SelectItem value="Arabic">Arabic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
        </div>
      ) : !mentors?.length ? (
        <div className="text-center py-16">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No mentors found</h3>
          <p className="text-muted-foreground">Be the first to become a mentor and help others!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {mentors.map(mentor => {
            const avail = availabilityConfig[mentor.availability] || availabilityConfig.available;
            const isSelf = user?.id === mentor.user_id;
            const spotsLeft = mentor.max_mentees - mentor.current_mentees;

            return (
              <Card key={mentor.id} className="overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarImage src={mentor.author?.profile_image || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {mentor.author?.first_name?.[0]}{mentor.author?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {mentor.author?.first_name} {mentor.author?.last_name}
                      </h3>
                      {mentor.author?.specialty && (
                        <p className="text-sm text-muted-foreground">{mentor.author.specialty}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={`text-xs ${avail.color}`}>
                          {avail.icon}
                          <span className="ml-1">{avail.label}</span>
                        </Badge>
                        {mentor.years_experience > 0 && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Star className="h-3 w-3" /> {mentor.years_experience}y exp
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {mentor.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{mentor.bio}</p>
                  )}

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {mentor.expertise.slice(0, 4).map(exp => (
                      <Badge key={exp} variant="secondary" className="text-xs">
                        {expertiseLabels[exp] || exp}
                      </Badge>
                    ))}
                    {mentor.expertise.length > 4 && (
                      <Badge variant="secondary" className="text-xs">+{mentor.expertise.length - 4}</Badge>
                    )}
                  </div>

                  {mentor.languages_spoken.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                      <Globe className="h-3 w-3" />
                      {mentor.languages_spoken.join(', ')}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {spotsLeft > 0 ? `${spotsLeft} spot${spotsLeft > 1 ? 's' : ''} left` : 'No spots available'}
                    </span>
                    {isLoggedIn && !isSelf && mentor.availability !== 'unavailable' && spotsLeft > 0 && (
                      <Button size="sm" variant="outline" onClick={() => setRequestMentor(mentor)}>
                        <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                        Request
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Request Dialog */}
      <Dialog open={!!requestMentor} onOpenChange={() => { setRequestMentor(null); setRequestMessage(''); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Mentorship</DialogTitle>
            <DialogDescription>
              Send a request to {requestMentor?.author?.first_name} {requestMentor?.author?.last_name}. 
              Introduce yourself and explain what you'd like help with.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Hi! I'm looking for guidance on..."
            value={requestMessage}
            onChange={e => setRequestMessage(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestMentor(null)}>Cancel</Button>
            <Button onClick={handleSendRequest} disabled={sendRequest.isPending}>
              {sendRequest.isPending ? 'Sending...' : 'Send Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MentorDirectory;
