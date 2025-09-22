import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { XCircle, Home, RefreshCw } from 'lucide-react';

const PaymentCancelled = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const lang = searchParams.get('lang');

  const handleTryAgain = () => {
    navigate('/learning', { replace: true });
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl border-orange-200">
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-10 h-10 text-orange-600" />
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {t?.payments?.cancelled?.title || 'Payment Cancelled'}
                </h1>
                
                <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                  {t?.payments?.cancelled?.message || 'Your payment was cancelled. No charges have been made to your account.'}
                </p>
                
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={handleTryAgain}
                      className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                      size="lg"
                    >
                      <RefreshCw className="w-4 h-4" />
                      {t?.payments?.cancelled?.tryAgain || 'Try Again'}
                    </Button>
                    
                    <Button 
                      onClick={() => navigate('/')} 
                      variant="outline" 
                      size="lg"
                      className="flex items-center gap-2"
                    >
                      <Home className="w-4 h-4" />
                      {t?.payments?.cancelled?.returnHome || 'Return to Home'}
                    </Button>
                  </div>
                </div>

                {/* Help Section */}
                <div className="mt-12 p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you're experiencing issues with the payment process, our support team is here to help.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => navigate('/contact')}>
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PaymentCancelled;