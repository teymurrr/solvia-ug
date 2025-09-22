import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { useProtectedAction } from '@/hooks/useProtectedAction';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Check, CreditCard, Shield, Clock, Users, Target } from 'lucide-react';

interface PaymentFlowProps {
  productType: 'homologation';
  onClose?: () => void;
}

interface DiscountInfo {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  discountAmount: number;
  finalAmount: number;
  description: string;
}

const PaymentFlow: React.FC<PaymentFlowProps> = ({ productType, onClose }) => {
  const { t, currentLanguage } = useLanguage();
  const { isLoggedIn, user } = useAuth();
  const { handleProtectedAction } = useProtectedAction();
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountInfo | null>(null);
  const [isValidatingDiscount, setIsValidatingDiscount] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const baseAmount = 75900; // €759
  const finalAmount = appliedDiscount ? appliedDiscount.finalAmount : baseAmount;

  const formatPrice = (amount: number) => {
    return `€${(amount / 100).toFixed(2)}`;
  };

  const validateDiscountCode = async () => {
    if (!discountCode.trim()) return;

    setIsValidatingDiscount(true);
    try {
      const { data, error } = await supabase.functions.invoke('validate-discount', {
        body: { code: discountCode.trim(), productType }
      });

      if (error) throw error;

      if (data.valid) {
        setAppliedDiscount(data.discount);
        toast.success(t?.payments?.discountCode?.applied || 'Discount applied successfully!');
      } else {
        toast.error(data.error || t?.payments?.discountCode?.invalid || 'Invalid discount code');
        setAppliedDiscount(null);
      }
    } catch (error: any) {
      console.error('Error validating discount:', error);
      toast.error(t?.payments?.discountCode?.invalid || 'Error validating discount code');
      setAppliedDiscount(null);
    } finally {
      setIsValidatingDiscount(false);
    }
  };

  const removeDiscount = () => {
    setDiscountCode('');
    setAppliedDiscount(null);
  };

  const handlePayment = async () => {
    const processPayment = async () => {
      setIsProcessingPayment(true);
      try {
        const { data, error } = await supabase.functions.invoke('create-payment', {
          body: {
            productType,
            discountCode: appliedDiscount?.code,
            locale: currentLanguage as 'en' | 'es' | 'de' | 'fr' | 'ru'
          }
        });

        if (error) throw error;

        if (data.url) {
          // Open Stripe Checkout in new tab
          window.open(data.url, '_blank');
          onClose?.();
        } else {
          throw new Error('No payment URL received');
        }
      } catch (error: any) {
        console.error('Payment error:', error);
        toast.error(error.message || t?.payments?.errors?.general || 'Payment processing failed');
      } finally {
        setIsProcessingPayment(false);
      }
    };

    handleProtectedAction(processPayment);
  };

  const features = t?.payments?.homologation?.features || [
    'Complete credential verification',
    'Documentation assistance',
    'Regulatory compliance support',
    'Expert guidance throughout the process',
    'Personalized support'
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Product Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            {t?.payments?.homologation?.title || 'Homologation Process Payment'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {t?.payments?.homologation?.description || 'Complete your homologation service payment to begin the process'}
          </p>
          
          <div className="grid gap-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Discount Code Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t?.payments?.discountCode?.label || 'Discount Code'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!appliedDiscount ? (
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder={t?.payments?.discountCode?.placeholder || 'Enter discount code'}
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && validateDiscountCode()}
                />
              </div>
              <Button
                onClick={validateDiscountCode}
                disabled={!discountCode.trim() || isValidatingDiscount}
                variant="outline"
              >
                {isValidatingDiscount ? '...' : (t?.payments?.discountCode?.apply || 'Apply')}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800">{appliedDiscount.code}</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {appliedDiscount.description}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={removeDiscount}>
                Remove
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            {t?.payments?.summary?.title || 'Payment Summary'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{t?.payments?.summary?.originalPrice || 'Original Price'}</span>
              <span>{formatPrice(baseAmount)}</span>
            </div>
            
            {appliedDiscount && (
              <div className="flex justify-between text-green-600">
                <span>{t?.payments?.summary?.discount || 'Discount'}</span>
                <span>-{formatPrice(appliedDiscount.discountAmount)}</span>
              </div>
            )}
            
            <Separator />
            
            <div className="flex justify-between text-lg font-semibold">
              <span>{t?.payments?.summary?.total || 'Total'}</span>
              <span>{formatPrice(finalAmount)}</span>
            </div>
          </div>

          <div className="pt-4">
            <Button
              onClick={handlePayment}
              disabled={isProcessingPayment}
              className="w-full bg-primary hover:bg-primary/90 text-white py-3"
              size="lg"
            >
              {isProcessingPayment 
                ? (t?.payments?.summary?.processing || 'Processing...')
                : (t?.payments?.summary?.proceedToPayment || 'Proceed to Payment')
              }
            </Button>
          </div>

          {/* Security & Trust Indicators */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>24h Support</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {!isLoggedIn && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <p className="text-sm text-amber-800 text-center">
              Please sign up or log in to continue with the payment process.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentFlow;