
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface MentorProfile {
  id: string;
  user_id: string;
  bio: string | null;
  expertise: string[];
  years_experience: number;
  languages_spoken: string[];
  availability: 'available' | 'limited' | 'unavailable';
  max_mentees: number;
  current_mentees: number;
  is_active: boolean;
  created_at: string;
  author?: {
    first_name: string;
    last_name: string;
    profile_image: string | null;
    specialty: string | null;
    location: string | null;
  };
}

export interface MentorRequest {
  id: string;
  mentor_id: string;
  mentee_id: string;
  message: string | null;
  status: string;
  created_at: string;
  mentor?: MentorProfile;
}

const EXPERTISE_OPTIONS = [
  'homologation',
  'fsp-preparation',
  'german-language',
  'job-search',
  'relocation',
  'visa-process',
  'hospital-life',
  'specialty-training',
];

export { EXPERTISE_OPTIONS };

export const useMentorDirectory = (filters?: { expertise?: string; language?: string }) => {
  return useQuery({
    queryKey: ['mentors', filters],
    queryFn: async () => {
      let query = supabase
        .from('mentor_profiles')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (filters?.expertise) {
        query = query.contains('expertise', [filters.expertise]);
      }
      if (filters?.language) {
        query = query.contains('languages_spoken', [filters.language]);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Enrich with profile data
      const enriched = await Promise.all(
        (data || []).map(async (mentor) => {
          const { data: profile } = await supabase
            .from('professional_profiles')
            .select('first_name, last_name, profile_image, specialty, location')
            .eq('id', mentor.user_id)
            .single();

          return { ...mentor, author: profile || undefined } as MentorProfile;
        })
      );

      return enriched;
    },
  });
};

export const useMyMentorProfile = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['my-mentor-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('mentor_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

export const useUpsertMentorProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (profile: {
      bio?: string;
      expertise: string[];
      years_experience: number;
      languages_spoken: string[];
      availability: string;
      max_mentees: number;
      is_active: boolean;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data: existing } = await supabase
        .from('mentor_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('mentor_profiles')
          .update(profile)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('mentor_profiles')
          .insert({ ...profile, user_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-mentor-profile'] });
      queryClient.invalidateQueries({ queryKey: ['mentors'] });
      toast({ title: 'Mentor profile saved!' });
    },
    onError: () => {
      toast({ title: 'Error saving profile', variant: 'destructive' });
    },
  });
};

export const useSendMentorRequest = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ mentorId, message }: { mentorId: string; message?: string }) => {
      if (!user?.id) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('mentor_requests')
        .insert({ mentor_id: mentorId, mentee_id: user.id, message });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-requests'] });
      toast({ title: 'Request sent!' });
    },
    onError: (err: any) => {
      const msg = err?.message?.includes('duplicate') ? 'You already sent a request' : 'Failed to send request';
      toast({ title: msg, variant: 'destructive' });
    },
  });
};

export const useMyMentorRequests = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['mentor-requests', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('mentor_requests')
        .select('*')
        .or(`mentee_id.eq.${user.id},mentor_id.in.(select id from mentor_profiles where user_id = '${user.id}')`)
        .order('created_at', { ascending: false });
      
      // Fallback: fetch separately for mentor requests
      if (error) {
        // Try just mentee requests
        const { data: menteeData, error: menteeError } = await supabase
          .from('mentor_requests')
          .select('*')
          .eq('mentee_id', user.id)
          .order('created_at', { ascending: false });
        if (menteeError) throw menteeError;
        return menteeData || [];
      }
      return data || [];
    },
    enabled: !!user?.id,
  });
};

export const useUpdateMentorRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ requestId, status }: { requestId: string; status: string }) => {
      const { error } = await supabase
        .from('mentor_requests')
        .update({ status })
        .eq('id', requestId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentor-requests'] });
      queryClient.invalidateQueries({ queryKey: ['mentors'] });
      toast({ title: 'Request updated!' });
    },
  });
};
