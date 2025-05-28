
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  console.log('🔍 [AdminRoute] Component rendering...');
  console.log('🔍 [AdminRoute] isAdmin:', isAdmin);
  console.log('🔍 [AdminRoute] adminLoading:', adminLoading);
  console.log('🔍 [AdminRoute] authLoading:', authLoading);
  console.log('🔍 [AdminRoute] isLoggedIn:', isLoggedIn);
  console.log('🔍 [AdminRoute] user:', user?.email);
  
  useEffect(() => {
    console.log('🔍 [AdminRoute] useEffect triggered');
    console.log('🔍 [AdminRoute] Current state - adminLoading:', adminLoading, 'authLoading:', authLoading, 'isLoggedIn:', isLoggedIn, 'isAdmin:', isAdmin);
    
    // Wait for both auth and admin loading to complete
    const isStillLoading = authLoading || adminLoading || isLoggedIn === undefined;
    
    if (!isStillLoading) {
      console.log('🔍 [AdminRoute] All loading complete, making access decision...');
      
      if (!isLoggedIn) {
        console.log('❌ [AdminRoute] User not logged in, redirecting to login');
        toast({
          title: "Authentication Required",
          description: "Please sign in to access this page.",
          variant: "destructive",
        });
        navigate("/login", { replace: true });
      } else if (!isAdmin) {
        console.log('❌ [AdminRoute] User not admin, redirecting to home');
        toast({
          title: "Access Denied",
          description: "Only administrators can access this page.",
          variant: "destructive",
        });
        navigate("/", { replace: true });
      } else {
        console.log('✅ [AdminRoute] User is admin, access granted');
      }
    } else {
      console.log('🔍 [AdminRoute] Still loading, waiting... (authLoading:', authLoading, ', adminLoading:', adminLoading, ', isLoggedIn:', isLoggedIn, ')');
    }
  }, [isAdmin, adminLoading, authLoading, isLoggedIn, toast, navigate]);
  
  // Show loading when any authentication check is still in progress
  if (authLoading || adminLoading || isLoggedIn === undefined) {
    console.log('🔍 [AdminRoute] Showing loading state');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-medical-600"></div>
        <p className="ml-4">Checking permissions...</p>
      </div>
    );
  }
  
  // Only render children when user is authenticated AND admin
  if (isLoggedIn && isAdmin) {
    console.log('✅ [AdminRoute] Rendering children');
    return <>{children}</>;
  }
  
  // Return null during transitions to prevent rendering children
  console.log('🔍 [AdminRoute] Returning null (transition state)');
  return null;
};

export default AdminRoute;
