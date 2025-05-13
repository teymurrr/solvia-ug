
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BlogComment } from '@/types/landing';
import { useAuth } from '@/contexts/AuthContext';

export const useBlogComments = (blogPostId: string | undefined) => {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      if (!blogPostId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('blog_comments')
          .select(`
            id, 
            blog_post_id, 
            user_id, 
            content, 
            created_at, 
            updated_at
          `)
          .eq('blog_post_id', blogPostId)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        // For each comment, fetch the user's name
        const commentsWithUserNames = await Promise.all(
          data.map(async (comment) => {
            // Try to get user name from the professional_profiles table
            const { data: userData } = await supabase
              .from('professional_profiles')
              .select('first_name, last_name')
              .eq('id', comment.user_id)
              .maybeSingle();

            // Try to get user name from institution_profiles table if not found
            let userName = 'Anonymous';
            if (userData) {
              userName = `${userData.first_name} ${userData.last_name}`;
            } else {
              const { data: instData } = await supabase
                .from('institution_profiles')
                .select('institution_name')
                .eq('id', comment.user_id)
                .maybeSingle();
              
              if (instData) {
                userName = instData.institution_name;
              }
            }

            return {
              ...comment,
              user_name: userName
            };
          })
        );
        
        setComments(commentsWithUserNames);
      } catch (error) {
        console.error('Error fetching blog comments:', error);
        setError('Failed to fetch comments');
        toast({
          title: 'Error',
          description: 'Failed to fetch comments',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [blogPostId, toast]);

  const addComment = async (content: string) => {
    if (!blogPostId || !user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to comment',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .insert({
          blog_post_id: blogPostId,
          user_id: user.id,
          content,
        })
        .select();

      if (error) throw error;

      // Get the user's name
      let userName = 'Anonymous';
      const { data: userData } = await supabase
        .from('professional_profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .maybeSingle();

      if (userData) {
        userName = `${userData.first_name} ${userData.last_name}`;
      } else {
        const { data: instData } = await supabase
          .from('institution_profiles')
          .select('institution_name')
          .eq('id', user.id)
          .maybeSingle();
        
        if (instData) {
          userName = instData.institution_name;
        }
      }

      const newComment = {
        ...data[0],
        user_name: userName,
      };

      setComments([...comments, newComment]);
      
      toast({
        title: 'Success',
        description: 'Comment added successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to add comment',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      setComments(comments.filter((comment) => comment.id !== commentId));
      
      toast({
        title: 'Success',
        description: 'Comment deleted successfully',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete comment',
        variant: 'destructive',
      });
      return false;
    }
  };

  return { 
    comments, 
    loading, 
    error, 
    addComment,
    deleteComment
  };
};
