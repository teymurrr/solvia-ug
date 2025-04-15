
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
            setTimeout(() => navigate('/login'), 1500);
            return;
          }
          
          if (data.session) {
            toast({
              title: 'Authentication Successful',
              description: 'You have been successfully authenticated.',
            });
            
            try {
              // Get user data including metadata
              const { data: userData, error: userError } = await supabase.auth.getUser();
              
              if (userError) {
                console.error('Error getting user data:', userError);
                // Still redirect to a default dashboard
                setTimeout(() => navigate('/dashboard/professional'), 1500);
                return;
              }
              
              const userMetadata = userData.user?.user_metadata;
              
              // Determine user type from metadata or default to 'professional'
              const userType = userMetadata?.user_type || 'professional';
              
              // Navigate to appropriate dashboard
              setTimeout(() => navigate(userType === 'professional' ? '/dashboard/professional' : '/dashboard/institution'), 1500);
            } catch (userDataError) {
              console.error('Error processing user data:', userDataError);
              // Fallback to professional dashboard
              setTimeout(() => navigate('/dashboard/professional'), 1500);
            }
          }
        } else {
          // No auth data in URL, redirect to login
          setTimeout(() => navigate('/login'), 1500);
        }
      } catch (error) {
        console.error('Error handling auth callback:', error);
        toast({
          title: 'Authentication Error',
          description: 'An unexpected error occurred during authentication.',
          variant: 'destructive',
        });
        setTimeout(() => navigate('/login'), 1500);
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
