import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useOwner } from '@/hooks/useOwner';
import { useBlogPosts } from '@/hooks/useBlogPosts';
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
  Loader2,
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

const AdminBlogList = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { isOwner, loading: ownerLoading } = useOwner();
  const { posts, loading } = useBlogPosts(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  console.log('🔍 [BlogList] Component rendering...');
  console.log('🔍 [BlogList] isAdmin:', isAdmin, 'adminLoading:', adminLoading);
  console.log('🔍 [BlogList] isOwner:', isOwner, 'ownerLoading:', ownerLoading);
  console.log('🔍 [BlogList] Current user email:', user?.email);

  React.useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/', { replace: true });
    }
  }, [adminLoading, isAdmin, navigate]);

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
      
      // Force reload to refresh the list
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
  
  if (adminLoading || loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-12 w-12 animate-spin text-medical-600" />
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </MainLayout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  // Check if current user is the specific owner
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
            
            {/* Temporary debug info - remove after fixing */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-2 p-2 bg-yellow-100 text-xs rounded">
                <p>Debug: User email: {user?.email}</p>
                <p>Debug: isOwner: {isOwner.toString()}</p>
                <p>Debug: ownerLoading: {ownerLoading.toString()}</p>
                <p>Debug: isSpecificOwner: {isSpecificOwner.toString()}</p>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            {/* Show the manage admins button only for owner - using multiple checks for reliability */}
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
                    <TableCell>{post.category || '—'}</TableCell>
                    <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
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
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>Delete</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default AdminBlogList;
