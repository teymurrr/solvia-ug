
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { useNavigate, Link } from 'react-router-dom';
import { useOwner } from '@/hooks/useOwner';
import { adminService, AdminUser } from '@/services/adminService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Plus,
  Trash2, 
  Shield,
  Loader2,
  Users
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
import { useToast } from '@/hooks/use-toast';

const AdminManagement = () => {
  const navigate = useNavigate();
  const { isOwner, loading: ownerLoading } = useOwner();
  const { toast } = useToast();
  
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [adminToRemove, setAdminToRemove] = useState<AdminUser | null>(null);
  const [removingAdmin, setRemovingAdmin] = useState(false);

  React.useEffect(() => {
    if (!ownerLoading && !isOwner) {
      navigate('/admin/blog', { replace: true });
    }
  }, [ownerLoading, isOwner, navigate]);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const adminList = await adminService.getAllAdmins();
      setAdmins(adminList);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast({
        title: 'Error',
        description: 'Failed to load admin list',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOwner) {
      fetchAdmins();
    }
  }, [isOwner]);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAdminEmail.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an email address',
        variant: 'destructive',
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newAdminEmail)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setAddingAdmin(true);
    try {
      await adminService.addAdmin(newAdminEmail);
      toast({
        title: 'Success',
        description: `Admin rights granted to ${newAdminEmail}`,
      });
      setNewAdminEmail('');
      fetchAdmins(); // Refresh the list
    } catch (error) {
      console.error('Error adding admin:', error);
      toast({
        title: 'Error',
        description: 'Failed to grant admin rights. Please check if the user exists.',
        variant: 'destructive',
      });
    } finally {
      setAddingAdmin(false);
    }
  };

  const confirmRemoveAdmin = (admin: AdminUser) => {
    setAdminToRemove(admin);
    setRemoveDialogOpen(true);
  };

  const handleRemoveAdmin = async () => {
    if (!adminToRemove) return;
    
    setRemovingAdmin(true);
    try {
      await adminService.removeAdmin(adminToRemove.id);
      toast({
        title: 'Success',
        description: 'Admin rights removed successfully',
      });
      fetchAdmins(); // Refresh the list
    } catch (error) {
      console.error('Error removing admin:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove admin rights',
        variant: 'destructive',
      });
    } finally {
      setRemovingAdmin(false);
      setRemoveDialogOpen(false);
      setAdminToRemove(null);
    }
  };
  
  if (ownerLoading || loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-12 w-12 animate-spin text-medical-600" />
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </MainLayout>
    );
  }

  if (!isOwner) {
    return null;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/admin/blog" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog Admin
              </Link>
            </Button>
            <h1 className="text-3xl font-bold flex items-center">
              <Shield className="mr-3 h-8 w-8 text-medical-600" />
              Admin Management
            </h1>
            <p className="text-muted-foreground">Manage administrator access for the platform</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add New Admin */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="mr-2 h-5 w-5" />
                Add New Administrator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    disabled={addingAdmin}
                  />
                </div>
                <Button type="submit" disabled={addingAdmin} className="w-full">
                  {addingAdmin ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Granting Admin Rights...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Grant Admin Rights
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Current Admins */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Current Administrators ({admins.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {admins.length > 0 ? (
                <div className="space-y-3">
                  {admins.map((admin) => (
                    <div key={admin.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">
                          {admin.first_name} {admin.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">{admin.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        onClick={() => confirmRemoveAdmin(admin)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No administrators found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Administrator</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove admin rights from{' '}
              <strong>{adminToRemove?.first_name} {adminToRemove?.last_name}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removingAdmin}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRemoveAdmin} 
              disabled={removingAdmin}
              className="bg-red-600 hover:bg-red-700"
            >
              {removingAdmin ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                <>Remove Admin Rights</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default AdminManagement;
