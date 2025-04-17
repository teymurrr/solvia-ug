
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserType } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType?: UserType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, userType }) => {
  const { isLoggedIn, userType: currentUserType, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Only show toast and redirect after authentication state is confirmed
    if (!loading) {
      if (!isLoggedIn) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to access this page.",
          variant: "destructive",
        });
        navigate("/login", { replace: true });
        return;
      } 
      
      if (userType && userType !== currentUserType) {
        toast({
          title: "Access Denied",
          description: `This page is only accessible to ${userType}s.`,
          variant: "destructive",
        });
        
        // Redirect to the appropriate dashboard based on user type
        if (currentUserType === 'professional') {
          navigate("/dashboard/professional", { replace: true });
        } else if (currentUserType === 'institution') {
          navigate("/dashboard/institution", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    }
  }, [isLoggedIn, userType, currentUserType, loading, toast, navigate]);
  
  // Show loading or nothing while auth state is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-medical-600"></div>
      </div>
    );
  }
  
  // Only render children when authenticated with correct user type
  if (isLoggedIn && (!userType || userType === currentUserType)) {
    return <>{children}</>;
  }
  
  // Return null during transitions to prevent rendering children
  return null;
};

export default ProtectedRoute;
