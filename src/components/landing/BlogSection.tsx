
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Newspaper, ArrowRight } from 'lucide-react';
import BlogPostCard from '@/components/BlogPostCard';

interface BlogSectionProps {
  posts: any[];
}

const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Newspaper className="h-[30px] w-[30px] text-[#006ae6] mx-auto mb-4" />
          <h2 className="text-[30px] font-bold text-black">Latest from Our Blog</h2>
          <p className="text-lg text-muted-foreground mt-4 mb-6">
            Stay updated with trends, insights, and expert advice in healthcare
          </p>
          <Button variant="ghost" asChild className="group">
            <Link to="/blog" className="flex items-center">
              View More
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
