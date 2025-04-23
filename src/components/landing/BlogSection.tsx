import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Book } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BlogPost } from '@/types/landing';

interface BlogSectionProps {
  posts: BlogPost[];
}

const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex flex-col items-center justify-center">
            <Book className="h-12 w-12 text-[#0EA5E9] mb-4" />
            <h2 className="text-[30px] font-bold text-black mb-2">Latest from Our Blog</h2>
            <p className="text-lg text-muted-foreground mb-4 max-w-xl mx-auto">
              Insights, stories, and tips for healthcare professionals and recruiters
            </p>
            <Button variant="ghost" asChild className="group mx-auto">
              <Link to="/blog" className="flex items-center">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((blog) => (
            <Card key={blog.id} className="border-transparent hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span>{blog.readTime}</span>
                  <span>•</span>
                  <span>{new Date(blog.date).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                <p className="text-muted-foreground mb-4">{blog.excerpt}</p>
                <Link
                  to={`/blog/${blog.id}`}
                  className="text-medical-600 hover:text-medical-700 font-medium inline-flex items-center group"
                >
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
