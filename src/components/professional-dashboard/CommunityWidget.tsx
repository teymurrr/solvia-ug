import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ThumbsUp, ArrowRight, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCommunityPosts } from '@/hooks/useCommunity';
import { useLanguage } from '@/hooks/useLanguage';
import { formatDistanceToNow } from 'date-fns';

interface CommunityWidgetProps {
  userSpecialty?: string | null;
}

const CommunityWidget: React.FC<CommunityWidgetProps> = ({ userSpecialty }) => {
  const { data: posts, isLoading } = useCommunityPosts();
  const { t } = useLanguage();
  const ct = (t as any)?.community;

  // Show up to 3 trending posts (sorted by upvotes + reply activity)
  const trendingPosts = (posts || [])
    .sort((a, b) => (b.upvotes + b.reply_count) - (a.upvotes + a.reply_count))
    .slice(0, 3);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">{ct?.title || 'Community'}</CardTitle>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/community" className="flex items-center gap-1 text-sm">
            {ct?.viewAll || 'View All'}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {trendingPosts.length === 0 ? (
          <div className="text-center py-6">
            <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-3">
              {ct?.noPosts || 'No discussions yet'}
            </p>
            <Button size="sm" asChild>
              <Link to="/community">{ct?.askQuestion || 'Ask a Question'}</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {trendingPosts.map(post => (
              <Link
                key={post.id}
                to={`/community/${post.id}`}
                className="block p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
              >
                <h4 className="font-medium text-sm text-foreground line-clamp-1 mb-1">
                  {post.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                  {post.content}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs py-0 px-1.5">
                    {(ct?.categories as any)?.[post.category.replace('-', '')] || post.category}
                  </Badge>
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
            <Button variant="outline" size="sm" className="w-full mt-2" asChild>
              <Link to="/community">
                {ct?.askQuestion || 'Ask a Question'}
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommunityWidget;
