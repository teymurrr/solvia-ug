
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertTriangle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/components/MainLayout';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

const EmailConfirmationRequired = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const email = localStorage.getItem('pendingConfirmationEmail');

  const handleResendEmail = async () => {
    // In a real implementation, we would call an API to resend the confirmation email
    // For now, we'll just show a toast
    toast({
      title: t.auth.confirmationEmailSent,
      description: t.auth.checkInboxForLink,
    });
  };

  return (
    <MainLayout>
      <div className="container max-w-md mx-auto py-12">
        <Card>
          <CardHeader className="space-y-1">
            <div className="mx-auto bg-yellow-100 p-3 rounded-full mb-4">
              <Mail className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">{t.auth.confirmEmail}</CardTitle>
            <CardDescription className="text-center">
              {t.auth.confirmEmailSent}
            </CardDescription>
            <p className="text-center font-medium">{email || 'your email address'}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <p className="text-sm text-amber-800">
                  {t.auth.confirmRequired}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t.auth.nextSteps}</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="bg-green-100 p-1 rounded-full">
                    <Check className="h-3.5 w-3.5 text-green-600" />
                  </div>
                  <span className="text-sm">{t.auth.checkInbox}</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-green-100 p-1 rounded-full">
                    <Check className="h-3.5 w-3.5 text-green-600" />
                  </div>
                  <span className="text-sm">{t.auth.clickLink}</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-green-100 p-1 rounded-full">
                    <Check className="h-3.5 w-3.5 text-green-600" />
                  </div>
                  <span className="text-sm">{t.auth.afterConfirm}</span>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              onClick={handleResendEmail}
              variant="outline" 
              className="w-full"
            >
              {t.auth.resendEmail}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              {t.auth.alreadyConfirmed}{" "}
              <Link 
                to="/login"
                className="text-medical-700 hover:text-medical-800 font-medium"
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
