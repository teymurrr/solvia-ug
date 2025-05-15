
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface BlogComment {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author?: {
    first_name: string;
    last_name: string;
    profile_image?: string;
  };
}

export const useBlogComments = (blogPostId: string) => {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchComments = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('blog_comments')
        .select(`
          id, 
          content, 
          created_at, 
          updated_at,
          user_id,
          professional_profiles:user_id (
            first_name,
            last_name,
            profile_image
          )
        `)
        .eq('blog_post_id', blogPostId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedComments: BlogComment[] = data.map(comment => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        updated_at: comment.updated_at,
        author: comment.professional_profiles ? {
          first_name: comment.professional_profiles.first_name || 'Anonymous',
          last_name: comment.professional_profiles.last_name || '',
          profile_image: comment.professional_profiles.profile_image
        } : undefined
      }));
      
      setComments(formattedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to comment',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('blog_comments')
        .insert({
          blog_post_id: blogPostId,
          user_id: user.id,
          content
        });
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Your comment has been posted',
      });
      
      // Refresh comments
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to post comment',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchComments();
  }, [blogPostId]);

  return { comments, loading, error, fetchComments, addComment };
};
