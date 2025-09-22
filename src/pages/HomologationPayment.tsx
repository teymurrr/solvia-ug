import React from 'react';
import MainLayout from '@/components/MainLayout';
import PaymentFlow from '@/components/payments/PaymentFlow';
import { useLanguage } from '@/hooks/useLanguage';

const HomologationPayment = () => {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-blue-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t?.payments?.homologation?.title || 'Homologation Process Payment'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t?.payments?.homologation?.description || 'Complete your homologation service payment to begin the process'}
            </p>
          </div>
          
          <PaymentFlow productType="homologation" />
        </div>
      </div>
    </MainLayout>
  );
};

export default HomologationPayment;