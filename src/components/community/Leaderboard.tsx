
import React from 'react';
import { Trophy, Award, Star, Crown, Medal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useLeaderboard } from '@/hooks/useReputation';
import { useLanguage } from '@/hooks/useLanguage';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getBadgeName } from '@/utils/badgeUtils';

const RANK_ICONS = [
  <Crown className="h-4 w-4 text-yellow-500" />,
  <Medal className="h-4 w-4 text-gray-400" />,
  <Medal className="h-4 w-4 text-amber-600" />,
];

const Leaderboard: React.FC = () => {
  const { data: leaders, isLoading } = useLeaderboard(5);
  const { currentLanguage } = useLanguage();

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" /> Top Contributors
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!leaders || leaders.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" /> Top Contributors
        </h3>
        <p className="text-sm text-muted-foreground">No activity yet. Be the first to contribute!</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
        <Trophy className="h-4 w-4 text-primary" /> Top Contributors
      </h3>
      <div className="space-y-3">
        {leaders.map((leader, index) => (
          <div key={leader.user_id} className="flex items-center gap-3">
            <div className="w-5 flex justify-center shrink-0">
              {index < 3 ? RANK_ICONS[index] : (
                <span className="text-xs font-medium text-muted-foreground">{index + 1}</span>
              )}
            </div>
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={leader.profile?.profile_image || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {leader.profile?.first_name?.[0]}{leader.profile?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {leader.profile?.first_name} {leader.profile?.last_name}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-primary font-semibold">{leader.total_points} pts</span>
                <TooltipProvider>
                  <div className="flex -space-x-1">
                    {leader.badges.slice(0, 3).map(ub => (
                      <Tooltip key={ub.id}>
                        <TooltipTrigger>
                          <div className="h-4 w-4 rounded-full bg-primary/10 border border-background flex items-center justify-center">
                            <Award className="h-2.5 w-2.5 text-primary" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{getBadgeName(ub.badge!, currentLanguage)}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                    {leader.badges.length > 3 && (
                      <div className="h-4 w-4 rounded-full bg-muted border border-background flex items-center justify-center">
                        <span className="text-[8px] font-bold text-muted-foreground">+{leader.badges.length - 3}</span>
                      </div>
                    )}
                  </div>
                </TooltipProvider>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
