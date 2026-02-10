
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, ThumbsUp, Pin, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MainLayout from '@/components/MainLayout';
import { useCommunityPosts } from '@/hooks/useCommunity';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import CreatePostDialog from '@/components/community/CreatePostDialog';
import Leaderboard from '@/components/community/Leaderboard';
import { formatDistanceToNow } from 'date-fns';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'homologation', label: 'Homologation' },
  { key: 'language', label: 'Language Learning' },
  { key: 'fsp', label: 'FSP Preparation' },
  { key: 'life-abroad', label: 'Life in Germany' },
  { key: 'job-search', label: 'Job Search' },
];

const Community = () => {
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const { data: posts, isLoading } = useCommunityPosts(category);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const ct = (t as any)?.community;

  const filteredPosts = (posts || []).filter(post =>
    !searchQuery || post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{ct?.title || 'Community'}</h1>
            <p className="text-muted-foreground mt-1">{ct?.subtitle || 'Ask questions, share experiences, and learn from fellow professionals'}</p>
          </div>
          <Button
            onClick={() => isLoggedIn ? setCreateOpen(true) : navigate('/login')}
            className="shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            {ct?.askQuestion || 'Ask a Question'}
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={ct?.searchPlaceholder || 'Search discussions...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {CATEGORIES.map(cat => (
            <Button
              key={cat.key}
              variant={category === cat.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategory(cat.key)}
              className="whitespace-nowrap"
            >
              {cat.key === 'all' ? (ct?.allCategories || 'All') : categoryLabel(cat.key)}
            </Button>
          ))}
        </div>

        {/* Post List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">{ct?.noPosts || 'No discussions yet'}</h3>
            <p className="text-muted-foreground mb-4">{ct?.beFirst || 'Be the first to start a discussion!'}</p>
            {isLoggedIn && (
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {ct?.askQuestion || 'Ask a Question'}
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPosts.map(post => (
              <Link
                key={post.id}
                to={`/community/${post.id}`}
                className="block bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 shrink-0 mt-0.5">
                    <AvatarImage src={post.author?.profile_image || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {post.author?.first_name?.[0]}{post.author?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {post.is_pinned && <Pin className="h-3.5 w-3.5 text-primary shrink-0" />}
                      <h3 className="font-semibold text-foreground truncate">{post.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{post.content}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{post.author?.first_name} {post.author?.last_name}</span>
                      {post.author?.specialty && (
                        <Badge variant="secondary" className="text-xs py-0">{post.author.specialty}</Badge>
                      )}
                      <Badge variant="outline" className="text-xs py-0">{categoryLabel(post.category)}</Badge>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" /> {post.upvotes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" /> {post.reply_count}
                      </span>
                      <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-72 shrink-0 space-y-4">
          <Leaderboard />
        </div>
        </div>
      </div>

      <CreatePostDialog open={createOpen} onOpenChange={setCreateOpen} />
    </MainLayout>
  );
};

export default Community;
