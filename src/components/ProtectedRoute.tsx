
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
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

  // Only handle navigation when auth is finished loading and conditions aren't met
  useEffect(() => {
    if (loading) {
      // Do nothing while loading
      return;
    }
    
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this page.",
        variant: "destructive",
      });
      navigate('/login', { replace: true });
    } else if (userType && userType !== currentUserType) {
      toast({
        title: "Access Denied",
        description: `This page is only accessible to ${userType}s.`,
        variant: "destructive",
      });
      
      // Redirect to the appropriate dashboard based on user type
      if (currentUserType === 'professional') {
        navigate('/dashboard/professional', { replace: true });
      } else if (currentUserType === 'institution') {
        navigate('/dashboard/institution', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isLoggedIn, userType, currentUserType, navigate, loading, toast]);

  // Show loading state while auth is loading
  if (loading) {
    return <div>Loading authentication...</div>;
  }

  // Simply render children if conditions are met
  if (isLoggedIn && (!userType || userType === currentUserType)) {
    return <>{children}</>;
  }
  
  // Return a loading state instead of null while the effect redirects
  // This prevents the component from trying to re-render during redirection
  return <div>Checking authorization...</div>;
};

export default ProtectedRoute;
