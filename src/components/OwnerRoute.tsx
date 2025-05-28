
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOwner } from '@/hooks/useOwner';
import { useToast } from '@/hooks/use-toast';

interface OwnerRouteProps {
  children: React.ReactNode;
}

const OwnerRoute: React.FC<OwnerRouteProps> = ({ children }) => {
  const { isOwner, loading } = useOwner();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Only show toast and redirect after owner check is completed
    if (!loading && !isOwner) {
      toast({
        title: "Access Denied",
        description: "Only the system owner can access this page.",
        variant: "destructive",
      });
      navigate("/admin/blog", { replace: true });
    }
  }, [isOwner, loading, toast, navigate]);
  
  // Show loading when checking owner status
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-medical-600"></div>
      </div>
    );
  }
  
  // Only render children when user is owner
  if (isOwner) {
    return <>{children}</>;
  }
  
  // Return null during transitions to prevent rendering children
  return null;
};

export default OwnerRoute;
