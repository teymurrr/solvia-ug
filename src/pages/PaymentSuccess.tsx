import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Home, User, Mail, Clock, ArrowRight, Phone, Star, Shield, Heart, FileText } from 'lucide-react';
import { toast } from 'sonner';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const { user, isLoggedIn } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [isVerifying, setIsVerifying] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmittingPhone, setIsSubmittingPhone] = useState(false);
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);
  const [paymentData, setPaymentData] = useState<{ targetCountry?: string; productType?: string } | null>(null);

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
          // For non-logged in users, store session info and prompt signup
          localStorage.setItem('pendingPaymentSession', sessionId);
          setVerificationStatus('success');
          setIsVerifying(false);
          return;
        }

        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { sessionId }
        });

        if (error || !data?.success) {
          throw new Error(data?.error || 'Payment verification failed');
        }

        // Store payment data for redirection
        if (data.payment) {
          setPaymentData({
            targetCountry: data.payment.metadata?.targetCountry || 'germany',
            productType: data.payment.productType,
          });
          // Store in localStorage for onboarding flow
          localStorage.setItem('paidCountry', data.payment.metadata?.targetCountry || 'germany');
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

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    
    setIsSubmittingPhone(true);
    try {
      // Update the client record with phone number if user exists
      if (user) {
        const { error } = await supabase
          .from('clients')
          .update({ phone: phoneNumber } as any)
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error saving phone:', error);
        }
      }
      
      setPhoneSubmitted(true);
      toast.success(t?.payments?.success?.phoneSubmitted || 'Phone number saved successfully!');
    } catch (error) {
      console.error('Error submitting phone:', error);
      toast.error(t?.payments?.errors?.general || 'An error occurred');
    } finally {
      setIsSubmittingPhone(false);
    }
  };

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
                    {t?.payments?.success?.verifying || 'Verifying Payment...'}
                  </h2>
                  <p className="text-muted-foreground">
                    {t?.payments?.success?.pleaseWait || 'Please wait while we confirm your payment.'}
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
                    {t?.payments?.errors?.verificationFailed || 'Payment Verification Failed'}
                  </h1>
                  <p className="text-lg text-muted-foreground mb-8">
                    {t?.payments?.errors?.contactSupport || "We couldn't verify your payment. Please contact support for assistance."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => navigate('/')} variant="outline" className="flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      {t?.payments?.success?.returnHome || 'Return to Home'}
                    </Button>
                    <Button asChild className="flex items-center gap-2">
                      <Link to="/contact">
                        <Mail className="w-4 h-4" />
                        {t?.payments?.errors?.contactSupportBtn || 'Contact Support'}
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
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                  {t?.payments?.success?.message || 'Your payment has been processed successfully. You will receive a confirmation email shortly.'}
                </p>
                
                {/* Reassurance Message */}
                <div className="bg-white/80 rounded-xl p-6 max-w-xl mx-auto border border-green-200">
                  <p className="text-green-800 font-medium text-lg">
                    {t?.payments?.success?.congratulations || "Congratulations! You've made an excellent decision."}
                  </p>
                  <p className="text-muted-foreground mt-2">
                    {t?.payments?.success?.reassurance || "You're now one step closer to achieving your dream of practicing medicine in Germany. Our expert team is here to guide you every step of the way."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
                <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">{t?.payments?.success?.trustBadge1 || '500+ Success Stories'}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
                <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">{t?.payments?.success?.trustBadge2 || 'Expert Guidance'}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border text-center">
                <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">{t?.payments?.success?.trustBadge3 || 'Personal Support'}</p>
              </div>
            </div>

            {/* Sign Up / Phone Number / Continue to Onboarding Section */}
            {!isLoggedIn ? (
              <Card className="shadow-lg border-primary/20 bg-gradient-to-r from-primary/5 to-blue-50 dark:from-primary/10 dark:to-background">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <User className="w-5 h-5" />
                    {t?.payments?.success?.createAccountTitle || 'Create Your Account'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    {t?.payments?.success?.createAccountDesc || 'Sign up now to track your progress and get personalized support throughout your homologation journey.'}
                  </p>
                  <Button onClick={() => navigate('/signup/professional')} size="lg" className="w-full">
                    {t?.payments?.success?.signUpNow || 'Sign Up Now'}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Continue to Document Upload CTA */}
                <Card className="shadow-lg border-primary/20 bg-gradient-to-r from-primary/5 to-blue-50 dark:from-primary/10 dark:to-background">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <FileText className="w-5 h-5" />
                      {t?.payments?.success?.continueTitle || 'Continue Your Journey'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      {t?.payments?.success?.continueDesc || 'Your payment is complete! Now let\'s collect some information and start uploading your documents.'}
                    </p>
                    <Button 
                      onClick={() => navigate('/onboarding')} 
                      size="lg" 
                      className="w-full gap-2"
                    >
                      {t?.payments?.success?.startOnboarding || 'Start Document Process'}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Phone Number Section */}
                {!phoneSubmitted ? (
                  <Card className="shadow-lg border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-foreground">
                        <Phone className="w-5 h-5" />
                        {t?.payments?.success?.phoneTitle || 'Stay Connected'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {t?.payments?.success?.phoneDesc || 'Leave your phone number so our team can reach you faster and provide personalized assistance via WhatsApp or call.'}
                      </p>
                      <form onSubmit={handlePhoneSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="phone">{t?.payments?.success?.phoneLabel || 'Phone Number (with country code)'}</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder={t?.payments?.success?.phonePlaceholder || '+49 123 456 7890'}
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <Button type="submit" size="lg" className="w-full" disabled={isSubmittingPhone || !phoneNumber.trim()}>
                          {isSubmittingPhone 
                            ? (t?.payments?.success?.submitting || 'Submitting...') 
                            : (t?.payments?.success?.submitPhone || 'Save Phone Number')}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="shadow-lg border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
                    <CardContent className="py-6 text-center">
                      <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                      <p className="text-green-800 dark:text-green-300 font-medium">
                        {t?.payments?.success?.phoneThankYou || 'Thank you! We will contact you shortly.'}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

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