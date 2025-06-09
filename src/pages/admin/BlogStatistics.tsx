
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, Eye, Heart, MessageSquare, FileText, Users, RefreshCw } from 'lucide-react';
import { useBlogStatistics } from '@/hooks/useBlogStatistics';
import { useAuthOptimized } from '@/hooks/useAuthOptimized';
import StatisticCard from '@/components/admin/blog/StatisticCard';
import BlogViewsChart from '@/components/admin/blog/BlogViewsChart';
import TopPostsChart from '@/components/admin/blog/TopPostsChart';
import CategoryDistributionChart from '@/components/admin/blog/CategoryDistributionChart';

const BlogStatistics: React.FC = () => {
  const { isAdmin } = useAuthOptimized();
  const {
    statistics,
    topViewedPosts,
    topLikedPosts,
    authorStats,
    viewsOverTime,
    loading,
    error,
    refetch
  } = useBlogStatistics();

  if (!isAdmin) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
            <p className="mt-2">You need admin privileges to view blog statistics.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive">Error Loading Statistics</h1>
            <p className="mt-2">{error}</p>
            <Button onClick={refetch} className="mt-4">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/admin/blog" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog Management
              </Link>
            </Button>
            <h1 className="text-3xl font-bold flex items-center">
              <BarChart3 className="mr-3 h-8 w-8" />
              Blog Statistics
            </h1>
            <p className="text-muted-foreground">
              Comprehensive analytics for your blog performance
            </p>
          </div>
          
          <Button onClick={refetch} disabled={loading} variant="outline">
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>

        {loading && !statistics ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-3">Loading statistics...</span>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatisticCard
                title="Total Posts"
                value={statistics?.total_posts || 0}
                description="Published blog posts"
                icon={FileText}
              />
              
              <StatisticCard
                title="Posts This Month"
                value={statistics?.posts_this_month || 0}
                description="New posts published"
                icon={FileText}
              />
              
              <StatisticCard
                title="Total Views"
                value={statistics?.total_views || 0}
                description="All-time page views"
                icon={Eye}
              />
              
              <StatisticCard
                title="Views This Month"
                value={statistics?.views_this_month || 0}
                description="Recent engagement"
                icon={Eye}
              />
              
              <StatisticCard
                title="Total Likes"
                value={statistics?.total_likes || 0}
                description="Reader appreciation"
                icon={Heart}
              />
              
              <StatisticCard
                title="Total Comments"
                value={statistics?.total_comments || 0}
                description="Community engagement"
                icon={MessageSquare}
              />
              
              <StatisticCard
                title="Active Authors"
                value={authorStats.length}
                description="Contributing writers"
                icon={Users}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Views Over Time */}
              <div className="lg:col-span-2">
                <BlogViewsChart data={viewsOverTime} loading={loading} />
              </div>
              
              {/* Top Posts by Views */}
              <TopPostsChart 
                data={topViewedPosts} 
                type="views" 
                loading={loading} 
              />
              
              {/* Top Posts by Likes */}
              <TopPostsChart 
                data={topLikedPosts} 
                type="likes" 
                loading={loading} 
              />
              
              {/* Category Distribution */}
              <CategoryDistributionChart 
                data={topViewedPosts} 
                loading={loading} 
              />
              
              {/* Author Statistics */}
              <div className="bg-white rounded-lg border shadow-sm">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold">Most Active Authors</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {authorStats.map((author, index) => (
                      <div key={author.author_id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">Author {author.author_id.slice(0, 8)}...</p>
                            <p className="text-sm text-muted-foreground">
                              {author.post_count} posts
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{author.total_views.toLocaleString()} views</p>
                          <p className="text-sm text-muted-foreground">
                            {author.total_likes} likes
                          </p>
                        </div>
                      </div>
                    ))}
                    {authorStats.length === 0 && (
                      <p className="text-muted-foreground text-center py-8">
                        No author data available yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default BlogStatistics;
