
import React, { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useJourneyUpdates, useCreateJourneyUpdate, useToggleReaction, MILESTONE_TYPES, MILESTONE_TEMPLATES } from '@/hooks/useJourneyUpdates';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const REACTION_EMOJIS = ['🎉', '👏', '💪', '❤️'];

const JourneyFeed: React.FC = () => {
  const { data: updates, isLoading } = useJourneyUpdates(8);
  const createUpdate = useCreateJourneyUpdate();
  const toggleReaction = useToggleReaction();
  const { isLoggedIn } = useAuth();

  const [showCompose, setShowCompose] = useState(false);
  const [content, setContent] = useState('');
  const [milestoneType, setMilestoneType] = useState('general');

  const handleSubmit = () => {
    if (!content.trim()) return;
    createUpdate.mutate({ content: content.trim(), milestone_type: milestoneType }, {
      onSuccess: () => {
        setContent('');
        setMilestoneType('general');
        setShowCompose(false);
      },
    });
  };

  const handleTemplate = (template: { type: string; text: string }) => {
    setContent(template.text);
    setMilestoneType(template.type);
    setShowCompose(true);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" /> Journey Updates
      </h3>

      {/* Compose */}
      {isLoggedIn && (
        <div className="mb-4">
          {!showCompose ? (
            <button
              onClick={() => setShowCompose(true)}
              className="w-full text-left text-sm text-muted-foreground bg-muted/50 rounded-md px-3 py-2 hover:bg-muted transition-colors"
            >
              Share a milestone...
            </button>
          ) : (
            <div className="space-y-2">
              {/* Milestone type pills */}
              <div className="flex flex-wrap gap-1">
                {MILESTONE_TYPES.map(mt => (
                  <button
                    key={mt.key}
                    onClick={() => setMilestoneType(mt.key)}
                    className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                      milestoneType === mt.key
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted text-muted-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    {mt.icon} {mt.label}
                  </button>
                ))}
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What milestone did you reach?"
                className="w-full text-sm bg-background border border-border rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-ring min-h-[60px]"
                maxLength={280}
              />
              {/* Templates */}
              {!content && (
                <div className="flex flex-wrap gap-1">
                  {MILESTONE_TEMPLATES.slice(0, 3).map((tpl, i) => (
                    <button
                      key={i}
                      onClick={() => handleTemplate(tpl)}
                      className="text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded-md hover:bg-muted transition-colors truncate max-w-full"
                    >
                      {tpl.text}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{content.length}/280</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { setShowCompose(false); setContent(''); }}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSubmit} disabled={!content.trim() || createUpdate.isPending}>
                    <Send className="h-3 w-3 mr-1" />
                    {createUpdate.isPending ? 'Posting...' : 'Share'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Feed */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-2">
              <Skeleton className="h-7 w-7 rounded-full shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-3 w-20 mb-1" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : !updates || updates.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No journey updates yet. Share your first milestone!
        </p>
      ) : (
        <div className="space-y-3">
          {updates.map(update => {
            const typeInfo = MILESTONE_TYPES.find(mt => mt.key === update.milestone_type);
            return (
              <div key={update.id} className="flex gap-2">
                <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                  <AvatarImage src={update.author?.profile_image || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                    {update.author?.first_name?.[0]}{update.author?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-medium text-foreground">
                      {update.author?.first_name} {update.author?.last_name}
                    </span>
                    {typeInfo && (
                      <span className="text-muted-foreground">{typeInfo.icon}</span>
                    )}
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">
                      {formatDistanceToNow(new Date(update.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground mt-0.5">{update.content}</p>
                  {/* Reactions */}
                  <div className="flex items-center gap-1 mt-1">
                    {update.reactions.map(r => (
                      <button
                        key={r.emoji}
                        onClick={() => isLoggedIn && toggleReaction.mutate({ updateId: update.id, emoji: r.emoji })}
                        className={`text-xs px-1.5 py-0.5 rounded-full border transition-colors ${
                          update.user_reactions.includes(r.emoji)
                            ? 'bg-primary/10 border-primary/30'
                            : 'bg-muted/50 border-border hover:border-primary/30'
                        }`}
                      >
                        {r.emoji} {r.count}
                      </button>
                    ))}
                    {/* Add reaction button */}
                    {isLoggedIn && (
                      <div className="relative group">
                        <button className="text-xs text-muted-foreground hover:text-foreground px-1 py-0.5 rounded transition-colors">
                          +
                        </button>
                        <div className="absolute bottom-full left-0 mb-1 hidden group-hover:flex bg-popover border border-border rounded-md shadow-md p-1 gap-0.5 z-10">
                          {REACTION_EMOJIS.map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => toggleReaction.mutate({ updateId: update.id, emoji })}
                              className="hover:bg-muted rounded px-1 py-0.5 text-sm"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JourneyFeed;
