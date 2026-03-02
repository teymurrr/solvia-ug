import React, { useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import PaymentFlow from '@/components/payments/PaymentFlow';
import { useLanguage } from '@/hooks/useLanguage';
import Analytics from '@/utils/analyticsTracking';

const HomologationPayment = () => {
  useEffect(() => {
    Analytics.paymentPageViewed('homologation');
  }, []);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background py-20">
        <div className="container mx-auto px-4">
          <PaymentFlow />
        </div>
      </div>
    </MainLayout>
  );
};

export default HomologationPayment;