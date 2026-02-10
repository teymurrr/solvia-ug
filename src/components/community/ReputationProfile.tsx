import React from 'react';
import { Award, Star, TrendingUp, MessageSquare, ThumbsUp, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { useUserReputation, useUserBadges, useAllBadges } from '@/hooks/useReputation';
import { useLanguage } from '@/hooks/useLanguage';
import { getBadgeName, getBadgeDescription } from '@/utils/badgeUtils';

const ICON_MAP: Record<string, React.ReactNode> = {
  star: <Star className="h-4 w-4" />,
  award: <Award className="h-4 w-4" />,
  'trending-up': <TrendingUp className="h-4 w-4" />,
  'message-square': <MessageSquare className="h-4 w-4" />,
  'thumbs-up': <ThumbsUp className="h-4 w-4" />,
  'check-circle': <CheckCircle className="h-4 w-4" />,
};

const ReputationProfile: React.FC = () => {
  const { user } = useAuth();
  const { data: reputation, isLoading: repLoading } = useUserReputation(user?.id);
  const { data: earnedBadges, isLoading: badgesLoading } = useUserBadges(user?.id);
  const { data: allBadges } = useAllBadges();
  const { currentLanguage, t } = useLanguage();
  const rt = (t as any)?.community?.reputation;

  const isLoading = repLoading || badgesLoading;

  if (!user) return null;

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
          </div>
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  const points = reputation?.total_points || 0;
  const earnedIds = new Set((earnedBadges || []).map(b => b.badge_id));

  const nextBadge = (allBadges || []).find(b => !earnedIds.has(b.id));

  let progressPercent = 100;
  let progressLabel = '';
  if (nextBadge) {
    const currentValue = (() => {
      switch (nextBadge.requirement_type) {
        case 'posts': return reputation?.posts_count || 0;
        case 'replies': return reputation?.replies_count || 0;
        case 'upvotes_received': return reputation?.upvotes_received || 0;
        case 'best_answers': return reputation?.best_answers_count || 0;
        case 'total_points': return points;
        default: return 0;
      }
    })();
    progressPercent = Math.min(100, Math.round((currentValue / nextBadge.requirement_value) * 100));
    progressLabel = `${currentValue} / ${nextBadge.requirement_value}`;
  }

  const stats = [
    { label: rt?.posts || 'Posts', value: reputation?.posts_count || 0, icon: <MessageSquare className="h-3.5 w-3.5" /> },
    { label: rt?.replies || 'Replies', value: reputation?.replies_count || 0, icon: <MessageSquare className="h-3.5 w-3.5" /> },
    { label: rt?.upvotes || 'Upvotes', value: reputation?.upvotes_received || 0, icon: <ThumbsUp className="h-3.5 w-3.5" /> },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            {rt?.title || 'Your Reputation'}
          </CardTitle>
          <span className="text-lg font-bold text-primary">{points} {(t as any)?.community?.leaderboard?.points || 'pts'}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {stats.map(stat => (
            <div key={stat.label} className="bg-muted/50 rounded-lg p-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-0.5">
                {stat.icon}
                <span className="text-xs">{stat.label}</span>
              </div>
              <p className="text-sm font-semibold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        {(earnedBadges || []).length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">{rt?.earnedBadges || 'Earned Badges'}</p>
            <TooltipProvider>
              <div className="flex flex-wrap gap-2">
                {(earnedBadges || []).map(ub => (
                  <Tooltip key={ub.id}>
                    <TooltipTrigger>
                      <div className="flex items-center gap-1.5 bg-primary/10 text-primary rounded-full px-2.5 py-1">
                        {ICON_MAP[ub.badge?.icon || 'award'] || <Award className="h-4 w-4" />}
                        <span className="text-xs font-medium">
                          {getBadgeName(ub.badge!, currentLanguage)}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{getBadgeDescription(ub.badge!, currentLanguage)}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </div>
        )}

        {nextBadge && (
          <div className="bg-muted/30 rounded-lg p-3 border border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">{rt?.nextBadge || 'Next badge'}</span>
              </div>
              <span className="text-xs text-muted-foreground">{progressLabel}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                {ICON_MAP[nextBadge.icon] || <Award className="h-3.5 w-3.5 text-muted-foreground" />}
              </div>
              <span className="text-sm font-medium text-foreground">
                {getBadgeName(nextBadge, currentLanguage)}
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}

        {!nextBadge && (earnedBadges || []).length > 0 && (
          <div className="bg-primary/5 rounded-lg p-3 text-center border border-primary/20">
            <CheckCircle className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-sm font-medium text-primary">{rt?.allBadgesEarned || 'All badges earned!'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReputationProfile;
