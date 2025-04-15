
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn, userType } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash fragment from the URL (Supabase puts auth info here)
        const hash = window.location.hash;
        
        if (hash && hash.includes('access_token')) {
          // Handle the callback
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Authentication error:', error);
            toast({
              title: 'Authentication Failed',
              description: 'There was a problem with the authentication process.',
              variant: 'destructive',
            });
            navigate('/login');
            return;
          }
          
          if (data.session) {
            toast({
              title: 'Authentication Successful',
              description: 'You have been successfully authenticated.',
            });
            
            // Get user data including metadata
            const { data: userData } = await supabase.auth.getUser();
            const userMetadata = userData.user?.user_metadata;
            
            // Determine user type from metadata or default to 'professional'
            const userType = userMetadata?.user_type || 'professional';
            
            // Navigate to appropriate dashboard
            navigate(userType === 'professional' ? '/dashboard/professional' : '/dashboard/institution');
          }
        } else {
          // No auth data in URL, redirect to login
          navigate('/login');
        }
      } catch (error) {
        console.error('Error handling auth callback:', error);
        toast({
          title: 'Authentication Error',
          description: 'An unexpected error occurred during authentication.',
          variant: 'destructive',
        });
        navigate('/login');
      }
    };

    // If the user is already logged in, redirect them
    if (isLoggedIn) {
      if (userType === 'professional') {
        navigate('/dashboard/professional');
      } else {
        navigate('/dashboard/institution');
      }
    } else {
      handleAuthCallback();
    }
  }, [isLoggedIn, navigate, toast, userType]);

  // Render a simple loading state
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Authenticating...</h2>
        <p className="text-muted-foreground">Please wait while we complete the process.</p>
      </div>
    </div>
  );
};

export default Auth;
