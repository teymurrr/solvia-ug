
import React, { useState } from 'react';
import { useBlogComments } from '@/hooks/useBlogComments';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useProtectedAction } from '@/hooks/useProtectedAction';
import { useLanguage } from '@/hooks/useLanguage';
import { Loader2 } from 'lucide-react';

interface BlogCommentsProps {
  blogPostId: string;
}

const BlogComments: React.FC<BlogCommentsProps> = ({ blogPostId }) => {
  const { isLoggedIn, user } = useAuth();
  const { comments, addComment, loading } = useBlogComments(blogPostId);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleProtectedAction } = useProtectedAction();
  const { t } = useLanguage();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    handleProtectedAction(async () => {
      setIsSubmitting(true);
      try {
        await addComment(commentText);
        setCommentText('');
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6">{t.blog.comments}</h3>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin h-8 w-8 text-medical-600" />
        </div>
      ) : (
        <>
          <div className="space-y-8 mb-8">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="border-b pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">
                      {comment.user_name || 'Anonymous'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <p>{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground py-4">{t.blog.noComments}</p>
            )}
          </div>

          <form onSubmit={handleSubmitComment} className="mt-6">
            <h4 className="font-semibold mb-2">{t.blog.leaveComment}</h4>
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={isLoggedIn ? t.blog.writeComment : t.blog.loginToComment}
              disabled={!isLoggedIn || isSubmitting}
              className="mb-4 min-h-[100px]"
            />
            <Button 
              type="submit" 
              disabled={!isLoggedIn || isSubmitting || !commentText.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.blog.submitting}
                </>
              ) : (
                t.blog.postComment
              )}
            </Button>
            {!isLoggedIn && (
              <p className="text-sm mt-2 text-muted-foreground">
                {t.blog.loginToComment.replace('Please login to comment', 'Please')} <Button variant="link" className="p-0 h-auto" onClick={() => handleProtectedAction()}>login</Button> to leave a comment.
              </p>
            )}
          </form>
        </>
      )}
    </div>
  );
};

export default BlogComments;
