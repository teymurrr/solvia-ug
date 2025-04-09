
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useProtectedAction = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleProtectedAction = (action?: () => void) => {
    if (isLoggedIn) {
      if (action) action();
    } else {
      toast({
        title: "Authentication Required",
        description: "Please sign up or log in to access this feature.",
        variant: "destructive",
      });
      navigate('/signup');
    }
  };
  
  return { handleProtectedAction };
};
