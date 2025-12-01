import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Home, User, Mail, Clock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const { user, isLoggedIn } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [isVerifying, setIsVerifying] = useState(true);

  const sessionId = searchParams.get('session_id');
  const lang = searchParams.get('lang') || currentLanguage;

  useEffect(() => {
    if (!sessionId) {
      setVerificationStatus('error');
      setIsVerifying(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        if (!isLoggedIn || !user) {
          throw new Error('User not authenticated');
        }

        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { sessionId }
        });

        if (error || !data?.success) {
          throw new Error(data?.error || 'Payment verification failed');
        }

        setVerificationStatus('success');
        toast.success(t?.payments?.success?.message || 'Payment verified successfully!');
      } catch (error: any) {
        console.error('Payment verification error:', error);
        setVerificationStatus('error');
        toast.error(error.message || t?.payments?.errors?.verificationFailed || 'Payment verification failed');
      } finally {
        setIsVerifying(false);
      }
    };

    // Add a small delay to show loading state
    const timer = setTimeout(verifyPayment, 1500);
    return () => clearTimeout(timer);
  }, [sessionId, isLoggedIn, user, t]);

  const nextSteps = t?.payments?.success?.stepsList || [
    'Check your email for payment confirmation',
    'Our team will contact you within 24 hours',
    'Begin your homologation process'
  ];

  if (isVerifying) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-blue-50 to-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="shadow-xl border-none">
                <CardContent className="py-16 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Verifying Payment...
                  </h2>
                  <p className="text-muted-foreground">
                    Please wait while we confirm your payment.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="shadow-xl border-red-200">
                <CardContent className="py-16 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Payment Verification Failed
                  </h1>
                  <p className="text-lg text-muted-foreground mb-8">
                    We couldn't verify your payment. Please contact support for assistance.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => navigate('/')} variant="outline" className="flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      {t?.payments?.success?.returnHome || 'Return to Home'}
                    </Button>
                    <Button asChild className="flex items-center gap-2">
                      <Link to="/contact">
                        <Mail className="w-4 h-4" />
                        Contact Support
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Success Header */}
            <Card className="shadow-xl border-none bg-gradient-to-r from-green-50 to-blue-50">
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {t?.payments?.success?.title || 'Payment Successful!'}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {t?.payments?.success?.message || 'Your payment has been processed successfully. You will receive a confirmation email shortly.'}
                </p>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-primary" />
                  {t?.payments?.success?.nextSteps || 'Next Steps'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-semibold text-primary">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700">{step}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Access Codes Notice */}
            <Card className="shadow-lg border-blue-200 bg-blue-50/50">
              <CardContent className="py-6">
                <div className="flex items-center gap-3 text-blue-800">
                  <Clock className="w-5 h-5" />
                  <p className="font-medium">
                    {t?.payments?.success?.accessCodesNotice || 'You will receive your access codes to the homologation platform within 24 hours.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/')} 
                variant="outline" 
                size="lg"
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                {t?.payments?.success?.returnHome || 'Return to Home'}
              </Button>
              {isLoggedIn && (
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  {t?.payments?.success?.viewDashboard || 'View Dashboard'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PaymentSuccess;