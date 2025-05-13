
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAdmin, loading } = useAdmin();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Only show toast and redirect after admin check is completed
    if (!loading && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can access this page.",
        variant: "destructive",
      });
      navigate("/", { replace: true });
    }
  }, [isAdmin, loading, toast, navigate]);
  
  // Show loading when checking admin status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-medical-600"></div>
      </div>
    );
  }
  
  // Only render children when user is admin
  if (isAdmin) {
    return <>{children}</>;
  }
  
  // Return null during transitions to prevent rendering children
  return null;
};

export default AdminRoute;
