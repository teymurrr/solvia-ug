
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Clock } from 'lucide-react';
import { BlogPost } from '@/types/landing';

interface BlogSectionProps {
  posts: BlogPost[];
}

const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Latest from Our Blog</h2>
          <Button variant="ghost" asChild className="group">
            <Link to="/blog" className="flex items-center">
              View All
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((blog) => (
            <Card key={blog.id} className="feature-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Clock className="h-4 w-4" />
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
