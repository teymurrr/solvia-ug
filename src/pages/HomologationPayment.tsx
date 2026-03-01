import React from 'react';
import MainLayout from '@/components/MainLayout';
import PaymentFlow from '@/components/payments/PaymentFlow';
import { useLanguage } from '@/hooks/useLanguage';

const HomologationPayment = () => {
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