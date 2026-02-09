
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

export const useProtectedAction = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const handleProtectedAction = (action?: () => void, signupPath = '/signup') => {
    if (isLoggedIn) {
      if (action) action();
    } else {
      toast({
        title: t?.chat?.authRequired || "Authentication Required",
        description: t?.chat?.authRequiredSignup || "Please sign up or log in to access this feature.",
        variant: "default",
      });
      navigate(signupPath);
    }
  };
  
  return { handleProtectedAction };
};
