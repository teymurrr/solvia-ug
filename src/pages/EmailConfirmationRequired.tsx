
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertTriangle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/components/MainLayout';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';

const EmailConfirmationRequired = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const email = localStorage.getItem('pendingConfirmationEmail');
  const [cooldownTime, setCooldownTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldownTime > 0) {
      timer = setTimeout(() => setCooldownTime(cooldownTime - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldownTime]);

  const handleResendEmail = async () => {
    if (!email || cooldownTime > 0 || isLoading) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        toast({ 
          title: t.common.error, 
          description: error.message, 
          variant: 'destructive' 
        });
      } else {
        toast({ 
          title: t.auth.confirmationEmailSent, 
          description: t.auth.checkInboxForLink 
        });
        setCooldownTime(60); // 60 second cooldown
      }
    } catch (err) {
      toast({ 
        title: t.common.error, 
        description: t?.chat?.failedToResend || 'Failed to resend email', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-md mx-auto py-12">
        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-3">
            <div className="mx-auto bg-amber-100 p-4 rounded-full mb-2">
              <Mail className="h-8 w-8 text-amber-600" />
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold text-center">
              {t.auth.confirmEmail}
            </CardTitle>
            <CardDescription className="text-center text-base">
              {t.auth.emailSentTo}
            </CardDescription>
            <p className="text-center font-semibold text-lg">{email || 'your email address'}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-amber-50 p-5 rounded-lg border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-900 font-medium">
                  {t.auth.mustConfirmBeforeLogin}
                </p>
              </div>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 flex items-center gap-3">
              <span className="text-2xl">🎁</span>
              <p className="text-sm text-foreground/80">
                {t.auth.freeGuideReminder}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold">{t.auth.nextSteps}</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-green-100 p-1.5 rounded-full flex-shrink-0 mt-0.5">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm text-foreground/90">{t.auth.checkInbox}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-green-100 p-1.5 rounded-full flex-shrink-0 mt-0.5">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm text-foreground/90">{t.auth.clickLink}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-green-100 p-1.5 rounded-full flex-shrink-0 mt-0.5">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm text-foreground/90">{t.auth.afterConfirm}</span>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              onClick={handleResendEmail}
              variant="outline" 
              size="lg"
              className="w-full"
              disabled={cooldownTime > 0 || isLoading}
            >
              {isLoading ? t.auth.sending : cooldownTime > 0 ? `${t.auth.wait} ${cooldownTime}s` : t.auth.resendEmail}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              {t.auth.alreadyConfirmed}{" "}
              <Link 
                to="/login"
                className="text-primary hover:text-primary/80 font-medium underline"
              >
                {t.auth.signIn}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default EmailConfirmationRequired;
