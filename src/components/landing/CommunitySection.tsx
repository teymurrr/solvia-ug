import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ThumbsUp, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCommunityPosts } from '@/hooks/useCommunity';
import { useLanguage } from '@/hooks/useLanguage';
import { formatDistanceToNow } from 'date-fns';

const CommunitySection: React.FC = () => {
  const { data: posts } = useCommunityPosts();
  const { t } = useLanguage();
  const ct = (t as any)?.community;

  const topPosts = (posts || [])
    .sort((a, b) => (b.upvotes + b.reply_count) - (a.upvotes + a.reply_count))
    .slice(0, 3);

  const categoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      homologation: ct?.categories?.homologation || 'Homologation',
      language: ct?.categories?.language || 'Language Learning',
      fsp: ct?.categories?.fsp || 'FSP Preparation',
      'life-abroad': ct?.categories?.lifeAbroad || 'Life in Germany',
      'job-search': ct?.categories?.jobSearch || 'Job Search',
    };
    return map[cat] || cat;
  };

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Users className="h-4 w-4" />
            <span>{ct?.professionalsSharing || '57+ professionals sharing their journey'}</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3">
            {ct?.title || 'Community'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {ct?.subtitle || 'Ask questions, share experiences, and learn from fellow professionals'}
          </p>
        </div>

        {topPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {topPosts.map(post => (
              <Link
                key={post.id}
                to={`/community/${post.id}`}
                className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-shadow flex flex-col"
              >
                <Badge variant="outline" className="w-fit text-xs mb-3">
                  {categoryLabel(post.category)}
                </Badge>
                <h3 className="font-semibold text-foreground line-clamp-2 mb-2 flex-1">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {post.content}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-3 border-t border-border">
                  <span className="font-medium text-foreground">
                    {post.author?.first_name} {post.author?.last_name?.[0]}.
                  </span>
                  <span className="flex items-center gap-0.5">
                    <ThumbsUp className="h-3 w-3" /> {post.upvotes}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <MessageSquare className="h-3 w-3" /> {post.reply_count}
                  </span>
                  <span className="ml-auto">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 mb-8">
            <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">{ct?.beFirst || 'Be the first to start a discussion!'}</p>
          </div>
        )}

        <div className="text-center">
          <Button size="lg" asChild>
            <Link to="/community" className="flex items-center gap-2">
              {ct?.joinCommunity || 'Join the Community'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
