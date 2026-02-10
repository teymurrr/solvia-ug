
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, MessageSquare, CheckCircle2, Pin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MainLayout from '@/components/MainLayout';
import { useCommunityPost, useCommunityReplies, useCreateReply, useToggleVote, useUserVotes } from '@/hooks/useCommunity';
import { useTranslatedPosts, useTranslatedReplies } from '@/hooks/useTranslatedPosts';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import TranslatedBadge from '@/components/community/TranslatedBadge';
import { formatDistanceToNow } from 'date-fns';
import { de, fr, es, ru } from 'date-fns/locale';

const dateFnsLocaleMap: Record<string, any> = { de, fr, es, ru };

const CommunityPostPage = () => {
  const { id } = useParams();
  const { data: post, isLoading: postLoading } = useCommunityPost(id);
  const { data: replies, isLoading: repliesLoading } = useCommunityReplies(id);
  const { data: userVotes } = useUserVotes(id);
  const createReply = useCreateReply();
  const toggleVote = useToggleVote();
  const { isLoggedIn } = useAuth();
  const { t, currentLanguage } = useLanguage();
  const [replyContent, setReplyContent] = useState('');

  const postsArray = post ? [post] : undefined;
  const { data: translationData } = useTranslatedPosts(postsArray, currentLanguage);
  const displayPost = translationData?.posts?.[0] || post;
  const postTranslated = translationData?.translatedIds?.has(post?.id || '') || false;

  const { data: replyTranslationData } = useTranslatedReplies(replies, currentLanguage);
  const displayReplies = replyTranslationData?.replies || replies;
  const translatedReplyIds = replyTranslationData?.translatedIds || new Set<string>();

  const dateFnsLocale = dateFnsLocaleMap[currentLanguage];

  const ct = (t as any)?.community;

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !id) return;
    await createReply.mutateAsync({ postId: id, content: replyContent });
    setReplyContent('');
  };

  const categoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      homologation: ct?.categories?.homologation || 'Homologation',
      language: ct?.categories?.language || 'Language Learning',
      fsp: ct?.categories?.fsp || 'FSP Preparation',
      'life-abroad': ct?.categories?.lifeAbroad || 'Life in Germany',
      'job-search': ct?.categories?.jobSearch || 'Job Search',
    };
    return labels[cat] || cat;
  };

  if (postLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-24">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!displayPost) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h2 className="text-xl font-semibold mb-4">{ct?.postNotFound || 'Post not found'}</h2>
          <Button asChild><Link to="/community">{ct?.backToCommunity || 'Back to Community'}</Link></Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link to="/community" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          {ct?.backToCommunity || 'Back to Community'}
        </Link>

        {/* Post */}
        <article className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            {displayPost.is_pinned && <Pin className="h-4 w-4 text-primary" />}
            <Badge variant="outline">{categoryLabel(displayPost.category)}</Badge>
            {displayPost.tags?.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
            {postTranslated && <TranslatedBadge />}
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-4">{displayPost.title}</h1>
          
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={displayPost.author?.profile_image || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {displayPost.author?.first_name?.[0]}{displayPost.author?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="text-sm font-medium">{displayPost.author?.first_name} {displayPost.author?.last_name}</span>
              {displayPost.author?.specialty && <span className="text-xs text-muted-foreground ml-2">{displayPost.author.specialty}</span>}
            </div>
            <span className="text-xs text-muted-foreground ml-auto">
              {formatDistanceToNow(new Date(displayPost.created_at), { addSuffix: true, locale: dateFnsLocale })}
            </span>
          </div>

          <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap mb-4">
            {displayPost.content}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => isLoggedIn && toggleVote.mutate({ postId: displayPost.id })}
              className={userVotes?.postVotes?.has(displayPost.id) ? 'text-primary' : ''}
              disabled={!isLoggedIn}
            >
              <ThumbsUp className="h-4 w-4 mr-1" /> {displayPost.upvotes}
            </Button>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <MessageSquare className="h-4 w-4" /> {displayPost.reply_count} {ct?.replies || 'replies'}
            </span>
          </div>
        </article>

        {/* Replies */}
        <div className="space-y-4 mb-6">
          <h2 className="text-lg font-semibold">{ct?.replies || 'Replies'} ({displayReplies?.length || 0})</h2>
          
          {repliesLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary" />
            </div>
          ) : displayReplies?.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4">{ct?.noReplies || 'No replies yet. Be the first to respond!'}</p>
          ) : (
            displayReplies?.map(reply => (
              <div
                key={reply.id}
                className={`bg-card border rounded-lg p-4 ${reply.is_best_answer ? 'border-primary bg-primary/5' : 'border-border'}`}
              >
                {reply.is_best_answer && (
                  <div className="flex items-center gap-1 text-primary text-sm font-medium mb-2">
                    <CheckCircle2 className="h-4 w-4" /> {ct?.bestAnswer || 'Best Answer'}
                  </div>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={reply.author?.profile_image || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {reply.author?.first_name?.[0]}{reply.author?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{reply.author?.first_name} {reply.author?.last_name}</span>
                  {reply.author?.specialty && <Badge variant="secondary" className="text-xs py-0">{reply.author.specialty}</Badge>}
                  {translatedReplyIds.has(reply.id) && <TranslatedBadge />}
                  <span className="text-xs text-muted-foreground ml-auto">
                    {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true, locale: dateFnsLocale })}
                  </span>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap mb-3">{reply.content}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => isLoggedIn && toggleVote.mutate({ replyId: reply.id })}
                  className={userVotes?.replyVotes?.has(reply.id) ? 'text-primary' : ''}
                  disabled={!isLoggedIn}
                >
                  <ThumbsUp className="h-3.5 w-3.5 mr-1" /> {reply.upvotes}
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Reply Form */}
        {isLoggedIn ? (
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-2">{ct?.yourReply || 'Your Reply'}</h3>
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={ct?.replyPlaceholder || 'Share your experience or answer...'}
              rows={3}
              className="mb-3"
            />
            <Button
              onClick={handleSubmitReply}
              disabled={!replyContent.trim() || createReply.isPending}
            >
              {createReply.isPending ? (ct?.submitting || 'Posting...') : (ct?.postReply || 'Post Reply')}
            </Button>
          </div>
        ) : (
          <div className="text-center py-6 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground mb-3">{ct?.loginToReply || 'Log in to join the discussion'}</p>
            <Button asChild><Link to="/login">{(t as any)?.common?.login || 'Log in'}</Link></Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CommunityPostPage;
