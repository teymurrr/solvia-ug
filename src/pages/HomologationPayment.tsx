import React from 'react';
import MainLayout from '@/components/MainLayout';
import PaymentFlow from '@/components/payments/PaymentFlow';
import { useLanguage } from '@/hooks/useLanguage';

const HomologationPayment = () => {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {t?.payments?.pageTitle || 'Homologation Process Payment'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t?.payments?.pageDescription || 'Choose the package that best fits your needs'}
            </p>
          </div>
          
          <PaymentFlow />
        </div>
      </div>
    </MainLayout>
  );
};

export default HomologationPayment;