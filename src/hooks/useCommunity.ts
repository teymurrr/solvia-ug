
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  upvotes: number;
  reply_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  author?: {
    first_name: string;
    last_name: string;
    specialty: string | null;
    profile_image: string | null;
  };
}

export interface CommunityReply {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  upvotes: number;
  is_best_answer: boolean;
  created_at: string;
  updated_at: string;
  author?: {
    first_name: string;
    last_name: string;
    specialty: string | null;
    profile_image: string | null;
  };
}

export const useCommunityPosts = (category?: string) => {
  return useQuery({
    queryKey: ['community-posts', category],
    queryFn: async () => {
      let query = supabase
        .from('community_posts')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch author profiles
      const userIds = [...new Set((data || []).map(p => p.user_id))];
      const { data: profiles } = await supabase
        .from('professional_profiles')
        .select('id, first_name, last_name, specialty, profile_image')
        .in('id', userIds);

      const profileMap = new Map(
        (profiles || []).map(p => [p.id, p])
      );

      return (data || []).map(post => ({
        ...post,
        tags: post.tags || [],
        author: profileMap.get(post.user_id) || {
          first_name: 'Anonymous',
          last_name: '',
          specialty: null,
          profile_image: null,
        },
      })) as CommunityPost[];
    },
  });
};

export const useCommunityPost = (postId: string | undefined) => {
  return useQuery({
    queryKey: ['community-post', postId],
    queryFn: async () => {
      if (!postId) throw new Error('No post ID');
      
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .eq('id', postId)
        .single();
      if (error) throw error;

      const { data: profile } = await supabase
        .from('professional_profiles')
        .select('id, first_name, last_name, specialty, profile_image')
        .eq('id', data.user_id)
        .single();

      return {
        ...data,
        tags: data.tags || [],
        author: profile || { first_name: 'Anonymous', last_name: '', specialty: null, profile_image: null },
      } as CommunityPost;
    },
    enabled: !!postId,
  });
};

export const useCommunityReplies = (postId: string | undefined) => {
  return useQuery({
    queryKey: ['community-replies', postId],
    queryFn: async () => {
      if (!postId) return [];

      const { data, error } = await supabase
        .from('community_replies')
        .select('*')
        .eq('post_id', postId)
        .order('is_best_answer', { ascending: false })
        .order('upvotes', { ascending: false })
        .order('created_at', { ascending: true });
      if (error) throw error;

      const userIds = [...new Set((data || []).map(r => r.user_id))];
      const { data: profiles } = await supabase
        .from('professional_profiles')
        .select('id, first_name, last_name, specialty, profile_image')
        .in('id', userIds);

      const profileMap = new Map(
        (profiles || []).map(p => [p.id, p])
      );

      return (data || []).map(reply => ({
        ...reply,
        author: profileMap.get(reply.user_id) || {
          first_name: 'Anonymous',
          last_name: '',
          specialty: null,
          profile_image: null,
        },
      })) as CommunityReply[];
    },
    enabled: !!postId,
  });
};

export const useUserVotes = (postId?: string) => {
  const { isLoggedIn } = useAuth();
  
  return useQuery({
    queryKey: ['community-votes', postId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { postVotes: new Set<string>(), replyVotes: new Set<string>() };

      let query = supabase
        .from('community_votes')
        .select('post_id, reply_id')
        .eq('user_id', user.id);

      if (postId) {
        // Get votes for this post and its replies
        query = query.or(`post_id.eq.${postId},reply_id.not.is.null`);
      }

      const { data } = await query;
      
      return {
        postVotes: new Set((data || []).filter(v => v.post_id).map(v => v.post_id!)),
        replyVotes: new Set((data || []).filter(v => v.reply_id).map(v => v.reply_id!)),
      };
    },
    enabled: isLoggedIn,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ title, content, category, tags }: { title: string; content: string; category: string; tags?: string[] }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('community_posts')
        .insert({ user_id: user.id, title, content, category, tags: tags || [] })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create post', variant: 'destructive' });
    },
  });
};

export const useCreateReply = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('community_replies')
        .insert({ post_id: postId, user_id: user.id, content })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['community-replies', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to post reply', variant: 'destructive' });
    },
  });
};

export const useToggleVote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, replyId }: { postId?: string; replyId?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if vote exists
      let query = supabase.from('community_votes').select('id').eq('user_id', user.id);
      if (postId) query = query.eq('post_id', postId);
      if (replyId) query = query.eq('reply_id', replyId);

      const { data: existing } = await query.maybeSingle();

      if (existing) {
        await supabase.from('community_votes').delete().eq('id', existing.id);
        return { action: 'removed' };
      } else {
        await supabase.from('community_votes').insert({
          user_id: user.id,
          post_id: postId || null,
          reply_id: replyId || null,
        });
        return { action: 'added' };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-votes'] });
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      queryClient.invalidateQueries({ queryKey: ['community-post'] });
      queryClient.invalidateQueries({ queryKey: ['community-replies'] });
    },
  });
};
