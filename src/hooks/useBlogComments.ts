import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useProfileData } from '@/components/professional-profile/hooks/useProfileData';

export interface BlogComment {
  id: string;
  blog_post_id: string; // Fixed: Changed from blog_id to blog_post_id
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_avatar?: string;
  user_type?: string;
  replies?: BlogComment[];
  parent_id?: string | null;
}

export const useBlogComments = (blogId: string) => {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { profileData } = useProfileData();

  // Fetch comments for a specific blog post
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*, user:user_id(id, email, user_metadata)')
        .eq('blog_post_id', blogId) // Fixed: Changed from blog_id to blog_post_id
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Process comments to add user information and organize replies
      const processedComments = data.map((comment: any) => {
        // Extract user information from the joined user data
        const userName = comment.user?.user_metadata?.full_name || 'Anonymous';
        const userAvatar = comment.user?.user_metadata?.avatar_url || null;
        const userType = comment.user?.user_metadata?.user_type || 'user';
        
        return {
          ...comment,
          user_name: userName,
          user_avatar: userAvatar,
          user_type: userType,
          replies: []
        };
      });
      
      // Organize comments into a hierarchy (top-level comments and their replies)
      const topLevelComments: BlogComment[] = [];
      const replyMap: Record<string, BlogComment[]> = {};
      
      processedComments.forEach((comment: BlogComment) => {
        if (!comment.parent_id) {
          topLevelComments.push(comment);
        } else {
          if (!replyMap[comment.parent_id]) {
            replyMap[comment.parent_id] = [];
          }
          replyMap[comment.parent_id].push(comment);
        }
      });
      
      // Attach replies to their parent comments
      topLevelComments.forEach(comment => {
        if (replyMap[comment.id]) {
          comment.replies = replyMap[comment.id];
        }
      });
      
      setComments(topLevelComments);
    } catch (err: any) {
      console.error('Error fetching blog comments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [blogId]);

  // Add a new comment
  const addComment = useCallback(async (content: string, parentId?: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to comment",
        variant: "destructive",
      });
      return false;
    }
    
    if (!content.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter some content for your comment",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      const newComment = {
        blog_post_id: blogId, // Fixed: Changed from blog_id to blog_post_id
        user_id: user.id,
        content,
        parent_id: parentId || null,
      };
      
      const { data, error } = await supabase
        .from('blog_comments')
        .insert(newComment)
        .select('*');
      
      if (error) throw error;
      
      // Add user information to the new comment for immediate display
      const commentWithUser: BlogComment = {
        ...data[0],
        user_name: profileData?.firstName ? `${profileData?.firstName} ${profileData?.lastName}` : 'Anonymous',
        user_avatar: profileData?.profileImage || null,
        user_type: user.user_metadata?.user_type || 'user',
        replies: []
      };
      
      // Update the comments state based on whether it's a reply or top-level comment
      if (parentId) {
        setComments(prevComments => {
          return prevComments.map(comment => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), commentWithUser]
              } as BlogComment;
            }
            return comment;
          });
        });
      } else {
        setComments(prevComments => [...prevComments, commentWithUser]);
      }
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully",
      });
      
      return true;
    } catch (err: any) {
      console.error('Error adding comment:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to add comment",
        variant: "destructive",
      });
      return false;
    }
  }, [user, blogId, toast, profileData]);

  // Delete a comment
  const deleteComment = useCallback(async (commentId: string, isReply: boolean = false, parentId?: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to delete a comment",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      // First check if the user is the author of the comment
      const { data: commentData, error: fetchError } = await supabase
        .from('blog_comments')
        .select('user_id')
        .eq('id', commentId)
        .single();
      
      if (fetchError) throw fetchError;
      
      if (commentData.user_id !== user.id) {
        toast({
          title: "Permission denied",
          description: "You can only delete your own comments",
          variant: "destructive",
        });
        return false;
      }
      
      // Delete the comment
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', commentId);
      
      if (error) throw error;
      
      // Update the comments state
      if (isReply && parentId) {
        setComments(prevComments => {
          return prevComments.map(comment => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: (comment.replies || []).filter(reply => reply.id !== commentId)
              };
            }
            return comment;
          });
        });
      } else {
        setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
      }
      
      toast({
        title: "Comment deleted",
        description: "Your comment has been removed",
      });
      
      return true;
    } catch (err: any) {
      console.error('Error deleting comment:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to delete comment",
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast]);

  // Edit a comment
  const editComment = useCallback(async (commentId: string, content: string, isReply: boolean = false, parentId?: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to edit a comment",
        variant: "destructive",
      });
      return false;
    }
    
    if (!content.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter some content for your comment",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      // First check if the user is the author of the comment
      const { data: commentData, error: fetchError } = await supabase
        .from('blog_comments')
        .select('user_id')
        .eq('id', commentId)
        .single();
      
      if (fetchError) throw fetchError;
      
      if (commentData.user_id !== user.id) {
        toast({
          title: "Permission denied",
          description: "You can only edit your own comments",
          variant: "destructive",
        });
        return false;
      }
      
      // Update the comment
      const { data, error } = await supabase
        .from('blog_comments')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', commentId)
        .select('*');
      
      if (error) throw error;
      
      // Update the comments state
      if (isReply && parentId) {
        setComments(prevComments => {
          return prevComments.map(comment => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: (comment.replies || []).map(reply => 
                  reply.id === commentId ? { ...reply, content, updated_at: data[0].updated_at } : reply
                )
              };
            }
            return comment;
          });
        });
      } else {
        setComments(prevComments => 
          prevComments.map(comment => 
            comment.id === commentId ? { ...comment, content, updated_at: data[0].updated_at } : comment
          )
        );
      }
      
      toast({
        title: "Comment updated",
        description: "Your comment has been edited successfully",
      });
      
      return true;
    } catch (err: any) {
      console.error('Error editing comment:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to edit comment",
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast]);

  // Load comments when the component mounts or blogId changes
  useEffect(() => {
    if (blogId) {
      fetchComments();
    }
  }, [blogId, fetchComments]);

  return {
    comments,
    loading,
    error,
    addComment,
    deleteComment,
    editComment,
    refreshComments: fetchComments,
  };
};
