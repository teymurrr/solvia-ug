
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserType } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType?: UserType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, userType }) => {
  const { isLoggedIn, userType: currentUserType } = useAuth();
  const { toast } = useToast();

  if (!isLoggedIn) {
    toast({
      title: "Authentication Required",
      description: "Please sign in to access this page.",
      variant: "destructive",
    });
    return <Navigate to="/login" replace />;
  }

  if (userType && userType !== currentUserType) {
    toast({
      title: "Access Denied",
      description: `This page is only accessible to ${userType}s.`,
      variant: "destructive",
    });
    
    // Redirect to the appropriate dashboard based on user type
    if (currentUserType === 'professional') {
      return <Navigate to="/dashboard/professional" replace />;
    } else if (currentUserType === 'institution') {
      return <Navigate to="/dashboard/institution" replace />;
    }
    
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
