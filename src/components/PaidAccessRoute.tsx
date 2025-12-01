import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePaymentAccess } from '@/hooks/usePaymentAccess';
import { useLanguage } from '@/hooks/useLanguage';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, ArrowRight, CreditCard } from 'lucide-react';

interface PaidAccessRouteProps {
  children: React.ReactNode;
  requiredCountry?: string; // If provided, checks for specific country access
}

const PaidAccessRoute: React.FC<PaidAccessRouteProps> = ({ children, requiredCountry }) => {
  const { isLoggedIn, loading: authLoading, user } = useAuth();
  const { isLoading: paymentLoading, paidCountries, hasPaidAccess } = usePaymentAccess();
  const { t } = useLanguage();
  const location = useLocation();

  // Show loading state
  if (authLoading || paymentLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has any paid access
  if (paidCountries.length === 0) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background py-20">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="shadow-xl border-none">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-2xl">
                  {t?.documents?.accessRequired?.title || 'Payment Required'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-muted-foreground">
                  {t?.documents?.accessRequired?.description || 
                    'To access the document upload and homologation process, you need to purchase a homologation package first.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => window.location.href = '/homologation-wizard'}
                    size="lg"
                    className="gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    {t?.documents?.accessRequired?.startProcess || 'Start Homologation Process'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  // If a specific country is required, check for that country's access
  if (requiredCountry && !hasPaidAccess(requiredCountry)) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background py-20">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="shadow-xl border-none">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
                  <Lock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-2xl">
                  {t?.documents?.accessRequired?.wrongCountry || 'Access Not Available'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-muted-foreground">
                  {t?.documents?.accessRequired?.wrongCountryDesc || 
                    `You don't have access to documents for this country. Please purchase the appropriate package or select a country you have access to.`}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = '/dashboard/professional'}
                    size="lg"
                  >
                    {t?.documents?.accessRequired?.goToDashboard || 'Go to Dashboard'}
                  </Button>
                  <Button 
                    onClick={() => window.location.href = '/homologation-wizard'}
                    size="lg"
                    className="gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    {t?.documents?.accessRequired?.purchaseForCountry || 'Purchase for This Country'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  // User has access, render children
  return <>{children}</>;
};

export default PaidAccessRoute;
