
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  useEffect(() => {
    const isStillLoading = authLoading || adminLoading || isLoggedIn === undefined;
    
    if (!isStillLoading) {
      if (!isLoggedIn) {
        toast({
          title: t?.chat?.authRequired || "Authentication Required",
          description: t?.chat?.authRequiredLogin || "Please sign in to access this page.",
          variant: "destructive",
        });
        navigate("/login", { replace: true });
      } else if (!isAdmin) {
        toast({
          title: t?.chat?.accessDenied || "Access Denied",
          description: t?.chat?.accessDeniedAdmin || "Only administrators can access this page.",
          variant: "destructive",
        });
        navigate("/", { replace: true });
      }
    }
  }, [isAdmin, adminLoading, authLoading, isLoggedIn, toast, navigate, t]);
  
  if (authLoading || adminLoading || isLoggedIn === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-medical-600"></div>
        <p className="ml-4">{t?.chat?.checkingPermissions || 'Checking permissions...'}</p>
      </div>
    );
  }
  
  if (isLoggedIn && isAdmin) {
    return <>{children}</>;
  }
  
  return null;
};

export default AdminRoute;
