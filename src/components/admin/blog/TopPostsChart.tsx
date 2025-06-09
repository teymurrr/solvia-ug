
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TopPost {
  id: string;
  title: string;
  view_count: number;
  like_count: number;
  category: string;
}

interface TopPostsChartProps {
  data: TopPost[];
  type: 'views' | 'likes';
  loading?: boolean;
}

const TopPostsChart: React.FC<TopPostsChartProps> = ({ data, type, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Posts by {type === 'views' ? 'Views' : 'Likes'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map(post => ({
    title: post.title.length > 30 ? `${post.title.substring(0, 30)}...` : post.title,
    fullTitle: post.title,
    value: type === 'views' ? post.view_count : post.like_count,
    category: post.category
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Posts by {type === 'views' ? 'Views' : 'Likes'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                dataKey="title" 
                type="category" 
                width={120}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => [value, type === 'views' ? 'Views' : 'Likes']}
                labelFormatter={(label, payload) => {
                  const data = payload?.[0]?.payload;
                  return data?.fullTitle || label;
                }}
              />
              <Bar 
                dataKey="value" 
                fill="hsl(var(--primary))"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopPostsChart;
