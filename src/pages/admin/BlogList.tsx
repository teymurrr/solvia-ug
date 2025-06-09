
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { useNavigate, Link } from 'react-router-dom';
import { useBlogPostsOptimized } from '@/hooks/useBlogPostsOptimized';
import { useAuthOptimized } from '@/hooks/useAuthOptimized';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Plus,
  ArrowLeft, 
  Edit,
  Trash2, 
  Eye,
  AlertTriangle,
  Settings
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import BlogListSkeleton from '@/components/ui/blog-list-skeleton';

const AdminBlogList = React.memo(() => {
  const navigate = useNavigate();
  const { isAdmin, isOwner, loading: authLoading } = useAuthOptimized();
  const { posts, loading } = useBlogPostsOptimized(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  React.useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/', { replace: true });
    }
  }, [authLoading, isAdmin, navigate]);

  const handleDelete = async () => {
    if (!postToDelete) return;
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postToDelete);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Blog post deleted successfully',
      });
      
      navigate(0);
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete blog post',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const confirmDelete = (postId: string) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const getLanguageFlag = (language: string) => {
    const flags = {
      en: '🇺🇸',
      de: '🇩🇪',
      es: '🇪🇸',
      fr: '🇫🇷',
      ru: '🇷🇺',
    };
    return flags[language as keyof typeof flags] || '🌐';
  };
  
  if (authLoading || loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Button variant="ghost" asChild className="mb-4">
                <Link to="/blog" className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Link>
              </Button>
              <h1 className="text-3xl font-bold">Blog Administration</h1>
              <p className="text-muted-foreground">Manage your blog posts</p>
            </div>
          </div>
          <BlogListSkeleton />
        </div>
      </MainLayout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const isSpecificOwner = user?.email === 'tmammadovv@gmail.com';

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/blog" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Blog Administration</h1>
            <p className="text-muted-foreground">Manage your blog posts</p>
          </div>
          
          <div className="flex gap-2">
            {(isOwner || isSpecificOwner) && (
              <Button variant="outline" asChild>
                <Link to="/admin/manage-admins" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Manage Admins
                </Link>
              </Button>
            )}
            
            <Button asChild>
              <Link to="/admin/blog/new" className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Link>
            </Button>
          </div>
        </div>

        {posts.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[150px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      {post.status === 'published' ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Published</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 hover:bg-gray-200">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{getLanguageFlag(post.language || 'en')}</span>
                        <span className="text-sm">{(post.language || 'en').toUpperCase()}</span>
                      </div>
                    </TableCell>
                    <TableCell>{post.category || '—'}</TableCell>
                    <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/blog/${post.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/admin/blog/edit/${post.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          onClick={() => confirmDelete(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No blog posts found</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first blog post.</p>
            <Button asChild>
              <Link to="/admin/blog/new">
                <Plus className="mr-2 h-4 w-4" />
                Create First Post
              </Link>
            </Button>
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              blog post and all associated comments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
});

AdminBlogList.displayName = 'AdminBlogList';

export default AdminBlogList;
