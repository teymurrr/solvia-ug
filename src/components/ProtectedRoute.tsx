
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserType } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType?: UserType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, userType }) => {
  const { isLoggedIn, userType: currentUserType, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        toast({
          title: t?.chat?.authRequired || "Authentication Required",
          description: t?.chat?.authRequiredLogin || "Please sign in to access this page.",
          variant: "default",
        });
        navigate("/login", { replace: true });
        return;
      } 
      
      if (userType && userType !== currentUserType) {
        toast({
          title: t?.chat?.accessDenied || "Access Denied",
          description: `This page is only accessible to ${userType}s.`,
          variant: "destructive",
        });
        
        if (currentUserType === 'professional') {
          navigate("/dashboard/professional", { replace: true });
        } else if (currentUserType === 'institution') {
          navigate("/dashboard/institution", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    }
  }, [isLoggedIn, userType, currentUserType, loading, toast, navigate, t]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-medical-600"></div>
      </div>
    );
  }
  
  if (isLoggedIn && (!userType || userType === currentUserType)) {
    return <>{children}</>;
  }
  
  return null;
};

export default ProtectedRoute;
