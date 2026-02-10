
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface JourneyUpdate {
  id: string;
  user_id: string;
  milestone_type: string;
  content: string;
  created_at: string;
  author?: {
    first_name: string;
    last_name: string;
    specialty: string | null;
    profile_image: string | null;
  };
  reactions: ReactionSummary[];
  user_reactions: string[]; // emojis current user has reacted with
}

export interface ReactionSummary {
  emoji: string;
  count: number;
}

const EMOJIS = ['🎉', '👏', '💪', '❤️'];

export const MILESTONE_TYPES = [
  { key: 'exam', label: 'Exam', icon: '📝' },
  { key: 'language', label: 'Language', icon: '🗣️' },
  { key: 'document', label: 'Document', icon: '📄' },
  { key: 'relocation', label: 'Relocation', icon: '✈️' },
  { key: 'job', label: 'Job', icon: '💼' },
  { key: 'general', label: 'General', icon: '⭐' },
];

export const MILESTONE_TEMPLATES = [
  { type: 'language', text: 'Passed my B2 German exam! 🎉' },
  { type: 'exam', text: 'Passed the FSP exam! 🏆' },
  { type: 'document', text: 'Got my Approbation approved! ✅' },
  { type: 'relocation', text: 'Just arrived in Germany! 🇩🇪' },
  { type: 'job', text: 'Started my first position at a hospital! 🏥' },
  { type: 'document', text: 'All documents apostilled and ready! 📋' },
];

export const useJourneyUpdates = (limit = 10) => {
  const { isLoggedIn } = useAuth();

  return useQuery({
    queryKey: ['journey-updates', limit],
    queryFn: async () => {
      const { data: updates, error } = await supabase
        .from('journey_updates')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;

      const userIds = [...new Set((updates || []).map(u => u.user_id))];
      const updateIds = (updates || []).map(u => u.id);

      const [{ data: profiles }, { data: reactions }] = await Promise.all([
        userIds.length > 0
          ? supabase.from('professional_profiles').select('id, first_name, last_name, specialty, profile_image').in('id', userIds)
          : { data: [] },
        updateIds.length > 0
          ? supabase.from('journey_reactions').select('update_id, emoji, user_id').in('update_id', updateIds)
          : { data: [] },
      ]);

      const profileMap = new Map((profiles || []).map(p => [p.id, p]));

      // Get current user id
      let currentUserId: string | null = null;
      if (isLoggedIn) {
        const { data: { user } } = await supabase.auth.getUser();
        currentUserId = user?.id || null;
      }

      return (updates || []).map(update => {
        const updateReactions = (reactions || []).filter(r => r.update_id === update.id);
        
        // Summarize reactions by emoji
        const emojiCounts = new Map<string, number>();
        const userEmojis: string[] = [];
        updateReactions.forEach(r => {
          emojiCounts.set(r.emoji, (emojiCounts.get(r.emoji) || 0) + 1);
          if (r.user_id === currentUserId) userEmojis.push(r.emoji);
        });

        const reactionSummary: ReactionSummary[] = EMOJIS
          .filter(e => emojiCounts.has(e))
          .map(e => ({ emoji: e, count: emojiCounts.get(e)! }));

        return {
          ...update,
          author: profileMap.get(update.user_id) || {
            first_name: 'Anonymous', last_name: '', specialty: null, profile_image: null,
          },
          reactions: reactionSummary,
          user_reactions: userEmojis,
        } as JourneyUpdate;
      });
    },
  });
};

export const useCreateJourneyUpdate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ content, milestone_type }: { content: string; milestone_type: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('journey_updates')
        .insert({ user_id: user.id, content, milestone_type })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey-updates'] });
      toast({ title: 'Update posted!', description: 'Your milestone is now visible to the community.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to post update', variant: 'destructive' });
    },
  });
};

export const useToggleReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ updateId, emoji }: { updateId: string; emoji: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: existing } = await supabase
        .from('journey_reactions')
        .select('id')
        .eq('update_id', updateId)
        .eq('user_id', user.id)
        .eq('emoji', emoji)
        .maybeSingle();

      if (existing) {
        await supabase.from('journey_reactions').delete().eq('id', existing.id);
        return { action: 'removed' };
      } else {
        await supabase.from('journey_reactions').insert({
          update_id: updateId, user_id: user.id, emoji,
        });
        return { action: 'added' };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journey-updates'] });
    },
  });
};
