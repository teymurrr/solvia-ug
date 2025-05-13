
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useBlogComments } from '@/hooks/useBlogComments';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, MessageCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface BlogCommentsProps {
  blogPostId: string;
}

const BlogComments: React.FC<BlogCommentsProps> = ({ blogPostId }) => {
  const { comments, loading, addComment, deleteComment } = useBlogComments(blogPostId);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAdmin } = useAdmin();
  const { isLoggedIn, user } = useAuth();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to leave a comment.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!newComment.trim()) {
      toast({
        title: 'Error',
        description: 'Comment cannot be empty.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const success = await addComment(newComment.trim());
    
    if (success) {
      setNewComment('');
    }
    
    setIsSubmitting(false);
  };
  
  const handleDelete = async (commentId: string) => {
    await deleteComment(commentId);
  };
  
  return (
    <div className="mt-12 space-y-8">
      <h2 className="text-2xl font-bold flex items-center">
        <MessageCircle className="mr-2" />
        Comments ({comments.length})
      </h2>
      
      {/* Add comment form for logged in users */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea 
            className="min-h-[120px] p-4"
            placeholder="Add your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isSubmitting}
          />
          <Button 
            type="submit" 
            disabled={isSubmitting || !newComment.trim()}
            className="flex items-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>Post Comment</>
            )}
          </Button>
        </form>
      ) : (
        <Card>
          <CardContent className="p-4">
            <p className="text-center py-2">
              Please <a href="/login" className="text-blue-600 hover:underline">sign in</a> to leave a comment.
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Comments list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-medical-600" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <Card key={comment.id} className="border-l-4 border-l-medical-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{comment.user_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(comment.created_at), 'MMM d, yyyy · h:mm a')}
                    </div>
                  </div>
                  {(isAdmin || (user && user.id === comment.user_id)) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(comment.id)}
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
                <p className="mt-3 whitespace-pre-line">{comment.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center py-4 text-muted-foreground">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};

export default BlogComments;
