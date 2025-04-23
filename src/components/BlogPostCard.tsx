
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CalendarIcon, User } from 'lucide-react';
import { formatDistance } from 'date-fns';

interface BlogPostCardProps {
  post: {
    id: string | number;
    title: string;
    excerpt: string;
    date: string;
    author: string;
    image: string;
    slug: string;
  };
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const formattedDate = post.date ? formatDistance(new Date(post.date), new Date(), { addSuffix: true }) : '';
  
  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md">
      <div className="relative aspect-[16/9]">
        <img 
          src={post.image || '/placeholder.svg'} 
          alt={post.title}
          className="object-cover w-full h-full"
        />
      </div>
      <CardContent className="flex-grow pt-6">
        <Link to={`/blog/${post.slug}`} className="group">
          <h3 className="text-xl font-semibold group-hover:text-medical-600 transition-colors line-clamp-2 mb-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-muted-foreground line-clamp-3 mb-4">
          {post.excerpt}
        </p>
        <div className="flex items-center text-sm text-muted-foreground gap-4 mt-auto">
          <div className="flex items-center">
            <CalendarIcon className="mr-1 h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <User className="mr-1 h-3.5 w-3.5" />
            <span>{post.author}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogPostCard;
