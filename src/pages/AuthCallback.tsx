
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/MainLayout';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setIsProcessing(true);
        
        // Process the callback URL which has the access_token and refresh_token as hash parameters
        const hashParams = new URLSearchParams(location.hash.substring(1));
        
        if (hashParams.has('error_description')) {
          const errorDescription = hashParams.get('error_description');
          throw new Error(errorDescription || 'Authentication error');
        }
        
        // If we have a session, the user is confirmed
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (session) {
          toast({
            title: "Email confirmed",
            description: "Your email has been successfully verified.",
          });
          navigate('/dashboard/professional');
        } else {
          // Try to exchange the token if present (fallback)
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          if (accessToken) {
            const { data, error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });
            
            if (setSessionError) throw setSessionError;
            
            if (data.session) {
              toast({
                title: "Email confirmed",
                description: "Your email has been successfully verified.",
              });
              
              // Redirect to appropriate dashboard based on user type
              const userType = data.session.user.user_metadata.user_type;
              navigate(userType === 'professional' ? '/dashboard/professional' : '/dashboard/institution');
            }
          } else {
            // No tokens available, might need to sign in
            throw new Error("No authentication tokens found.");
          }
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setError(error.message || 'Failed to process authentication');
        toast({
          title: "Authentication error",
          description: error.message || "Failed to process authentication response. Please try signing in again.",
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [location, navigate, toast]);

  return (
    <MainLayout>
      <div className="container max-w-md mx-auto py-12">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-4">
            {isProcessing ? "Verifying your account..." : (error ? "Authentication Failed" : "Account Verified")}
          </h1>
          
          {isProcessing ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div>
              <p className="text-center text-red-500 mb-4">{error}</p>
              <div className="flex justify-center">
                <button 
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                >
                  Return to Login
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-4">Your email has been successfully verified.</p>
              <p className="mb-4">You will be redirected to your dashboard shortly.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default AuthCallback;
