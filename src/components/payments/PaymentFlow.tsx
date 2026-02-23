import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Check, Shield, Clock, BookOpen, Users, Star, ExternalLink, Zap } from 'lucide-react';
import { preOpenPaymentWindow, redirectPaymentWindow, isSafari } from '@/utils/browserDetection';
import Analytics from '@/utils/analyticsTracking';

type ProductType = 'digital_starter' | 'complete' | 'personal_mentorship';

interface PaymentFlowProps {
  productType?: ProductType;
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

interface PackageConfig {
  id: ProductType;
  icon: React.ReactNode;
  price: number;
  introPrice: number;
  popular?: boolean;
  features: string[];
}

// Package pricing configuration
const getPricingByCountry = (country: string | null): Record<ProductType, { price: number; introPrice: number }> => {
  return {
    digital_starter: { price: 7900, introPrice: 3900 },       // €79 → €39
    complete: { price: 37900, introPrice: 18900 },              // €379 → €189
    personal_mentorship: { price: 89900, introPrice: 49900 },   // €899 → €499
  };
};

const getCountryDisplayName = (country: string | null, t: any): string => {
  if (!country) return '';
  
  const countryNames: Record<string, string> = {
    germany: t?.wizard?.countries?.germany || 'Germany',
    austria: t?.wizard?.countries?.austria || 'Austria',
    spain: t?.wizard?.countries?.spain || 'Spain',
    italy: t?.wizard?.countries?.italy || 'Italy',
    france: t?.wizard?.countries?.france || 'France',
  };
  
  return countryNames[country] || country;
};

const getCountryFlag = (country: string | null): string => {
  const flags: Record<string, string> = {
    germany: '🇩🇪',
    austria: '🇦🇹',
    spain: '🇪🇸',
    italy: '🇮🇹',
    france: '🇫🇷',
  };
  
  return flags[country || ''] || '🌍';
};

// Get the language name based on target country
const getLanguageForCountry = (country: string | null, t: any): string => {
  const languages: Record<string, string> = {
    germany: t?.payments?.languageNames?.german || 'German',
    austria: t?.payments?.languageNames?.german || 'German',
    spain: t?.payments?.languageNames?.spanish || 'Spanish',
    italy: t?.payments?.languageNames?.italian || 'Italian',
    france: t?.payments?.languageNames?.french || 'French',
  };
  
  return languages[country || ''] || (t?.payments?.languageNames?.german || 'German');
};

const PaymentFlow: React.FC<PaymentFlowProps> = ({ onClose }) => {
  const { t, currentLanguage } = useLanguage();
  const [selectedPackage, setSelectedPackage] = useState<ProductType | null>(null);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountInfo | null>(null);
  const [isValidatingDiscount, setIsValidatingDiscount] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [targetCountry, setTargetCountry] = useState<string | null>(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);
  const [showFallbackDialog, setShowFallbackDialog] = useState(false);
  const paymentSummaryRef = useRef<HTMLDivElement>(null);

  // Read wizard data from localStorage on mount
  useEffect(() => {
    const wizardDataStr = localStorage.getItem('wizardData');
    if (wizardDataStr) {
      try {
        const wizardData = JSON.parse(wizardDataStr);
        setTargetCountry(wizardData.targetCountry || null);
        // Pre-fill email if available from wizard
        if (wizardData.email) {
          setGuestEmail(wizardData.email);
        }
      } catch (e) {
        console.error('Error parsing wizard data:', e);
      }
    }
  }, []);

  // Auto-scroll to payment summary when a package is selected
  useEffect(() => {
    if (selectedPackage && paymentSummaryRef.current) {
      setTimeout(() => {
        paymentSummaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [selectedPackage]);

  // Get pricing based on selected country
  const pricing = getPricingByCountry(targetCountry);

  const packages: PackageConfig[] = [
    {
      id: 'digital_starter',
      icon: <Shield className="w-8 h-8" />,
      price: pricing.digital_starter.price,
      introPrice: pricing.digital_starter.introPrice,
      features: t?.payments?.packages?.digitalStarter?.features || [
        'AI-powered document analysis & validation',
        'Country-specific document checklist & templates',
        'Step-by-step explanation videos for each document',
        'Apostille & translation instructions',
        'Medical CV template',
        'Email support (response within 72h)'
      ]
    },
    {
      id: 'complete',
      icon: <BookOpen className="w-8 h-8" />,
      price: pricing.complete.price,
      introPrice: pricing.complete.introPrice,
      popular: true,
      features: t?.payments?.packages?.complete?.features || [
        'Everything in Digital Guide',
        'Personal expert review of every document before submission',
        'Direct communication with authorities on your behalf',
        'Application submission support',
        'FSP/equivalence exam preparation material',
        'Priority support (response within 24h)',
        'Progress tracking dashboard'
      ]
    },
    {
      id: 'personal_mentorship',
      icon: <Users className="w-8 h-8" />,
      price: pricing.personal_mentorship.price,
      introPrice: pricing.personal_mentorship.introPrice,
      features: t?.payments?.packages?.personalMentorship?.features || [
        'Everything in Full Support',
        '12-month medical language course access',
        '4× live 1:1 sessions (60 min): document review, exam prep & interview coaching',
        'Dedicated case manager from start to finish',
        'In-person support for key appointments (where available)',
        'We handle all authority communication & paperwork',
        'Job matching with open positions on our platform',
        'Direct WhatsApp & phone support'
      ]
    }
  ];

  const getPackageTitle = (id: ProductType) => {
    const languageName = getLanguageForCountry(targetCountry, t);
    switch (id) {
      case 'digital_starter':
        return t?.payments?.packages?.digitalStarter?.title || 'Digital Starter';
      case 'complete':
        // Dynamic language name based on country
        const completeBase = t?.payments?.packages?.complete?.titleBase || 'Complete Package +';
        return `${completeBase} ${languageName}`;
      case 'personal_mentorship':
        return t?.payments?.packages?.personalMentorship?.title || 'Personal Mentorship';
    }
  };

  const getPackageDescription = (id: ProductType) => {
    const languageName = getLanguageForCountry(targetCountry, t);
    switch (id) {
      case 'digital_starter':
        return t?.payments?.packages?.digitalStarter?.description || 'Prepare your documents independently with our digital guides';
      case 'complete':
        // Dynamic language name in description
        const descBase = t?.payments?.packages?.complete?.descriptionBase || 'Full homologation support +';
        const descEnd = t?.payments?.packages?.complete?.descriptionEnd || 'language preparation';
        return `${descBase} ${languageName} ${descEnd}`;
      case 'personal_mentorship':
        const premiumBase = t?.payments?.packages?.personalMentorship?.descriptionBase || 'Your dedicated team guiding you with 1:1';
        const premiumEnd = t?.payments?.packages?.personalMentorship?.descriptionEnd || 'lessons';
        return `${premiumBase} ${languageName} ${premiumEnd}`;
    }
  };

  const formatPrice = (amount: number) => {
    return `€${(amount / 100).toFixed(0)}`;
  };

  const selectedConfig = packages.find(p => p.id === selectedPackage);
  const baseAmount = selectedConfig?.introPrice || 0;
  const finalAmount = appliedDiscount ? appliedDiscount.finalAmount : baseAmount;

  const validateDiscountCode = async () => {
    if (!discountCode.trim() || !selectedPackage) return;

    setIsValidatingDiscount(true);
    try {
      const { data, error } = await supabase.functions.invoke('validate-discount', {
        body: { code: discountCode.trim(), productType: selectedPackage, targetCountry }
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

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

   const handlePayment = async () => {
     if (!selectedPackage) {
       toast.error(t?.payments?.errors?.selectPackage || 'Please select a package');
       return;
     }

     if (!guestEmail || !isValidEmail(guestEmail)) {
       toast.error(t?.payments?.errors?.invalidEmail || 'Please enter a valid email address');
       return;
     }

     // Track payment start
     const baseAmount = selectedConfig?.price || 0;
     const finalAmount = appliedDiscount ? appliedDiscount.finalAmount : baseAmount;
     Analytics.paymentStarted(selectedPackage, finalAmount);

     // Pre-open window for Safari BEFORE the async call
     const preOpenedWindow = preOpenPaymentWindow();

     setIsProcessingPayment(true);
     try {
       const { data, error } = await supabase.functions.invoke('create-payment', {
         body: {
           productType: selectedPackage,
           targetCountry: targetCountry,
           customerEmail: guestEmail,
           discountCode: appliedDiscount?.code,
           locale: currentLanguage as 'en' | 'es' | 'de' | 'fr' | 'ru'
         }
       });

      if (error) throw error;

      if (data.url) {
        // For Safari: redirect the pre-opened window
        if (preOpenedWindow) {
          const success = redirectPaymentWindow(preOpenedWindow, data.url);
          if (success) {
            onClose?.();
            return;
          }
          // If redirect failed (window closed), show fallback
          setFallbackUrl(data.url);
          setShowFallbackDialog(true);
        } else if (isSafari()) {
          // Safari but window was blocked, show fallback dialog
          setFallbackUrl(data.url);
          setShowFallbackDialog(true);
        } else {
          // Non-Safari browsers: use regular window.open
          window.open(data.url, '_blank');
          onClose?.();
        }
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      // Close the pre-opened window if there was an error
      if (preOpenedWindow && !preOpenedWindow.closed) {
        preOpenedWindow.close();
      }
      toast.error(error.message || t?.payments?.errors?.general || 'Payment processing failed');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleFallbackClick = () => {
    if (fallbackUrl) {
      window.location.href = fallbackUrl;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Country Indicator */}
      
      {/* Country Indicator */}
      {targetCountry && (
        <div className="text-center">
          <Badge variant="secondary" className="text-base px-4 py-2">
            {getCountryFlag(targetCountry)} {t?.payments?.packagesFor || 'Packages for'} {getCountryDisplayName(targetCountry, t)}
          </Badge>
        </div>
      )}

      {/* Package Selection */}
      <div className="grid md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg flex flex-col ${
              selectedPackage === pkg.id
                ? 'border-primary ring-2 ring-primary/20 shadow-lg'
                : 'border-border hover:border-primary/50'
            } ${pkg.popular ? 'md:-mt-4 md:mb-4' : ''}`}
            onClick={() => {
              setSelectedPackage(pkg.id);
              setAppliedDiscount(null);
            }}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-3 py-1">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  {t?.payments?.popular || 'Most Popular'}
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pt-8 pb-4">
              <div className={`mx-auto p-3 rounded-full mb-4 ${
                selectedPackage === pkg.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {pkg.icon}
              </div>
              <CardTitle className="text-xl">{getPackageTitle(pkg.id)}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {getPackageDescription(pkg.id)}
              </p>
            </CardHeader>
            
            <CardContent className="text-center pb-6 flex-1 flex flex-col">
              <div className="mb-6">
                <Badge variant="outline" className="mb-2 text-xs border-primary/30 text-primary">
                  <Zap className="w-3 h-3 mr-1" />
                  {t?.payments?.limitedOffer || 'Limited introductory offer'}
                </Badge>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg text-muted-foreground line-through">{formatPrice(pkg.price)}</span>
                  <span className="text-4xl font-bold text-primary">{formatPrice(pkg.introPrice)}</span>
                </div>
                <span className="text-sm text-muted-foreground">{t?.payments?.oneTime || 'one-time'}</span>
              </div>
              
              <div className="space-y-3 text-left">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      selectedPackage === pkg.id ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button
                variant={selectedPackage === pkg.id ? 'default' : 'outline'}
                className="w-full mt-auto pt-6"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPackage(pkg.id);
                }}
              >
                {selectedPackage === pkg.id 
                  ? (t?.payments?.selected || 'Selected')
                  : (t?.payments?.select || 'Select Package')
                }
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Discount Code & Payment Section */}
      {selectedPackage && (
        <Card ref={paymentSummaryRef} className="animate-in fade-in-50 duration-300">
          <CardHeader>
            <CardTitle className="text-lg">
              {t?.payments?.summary?.title || 'Payment Summary'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Input for Guest Checkout */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t?.payments?.emailLabel || 'Email Address'} *
              </label>
              <Input
                type="email"
                placeholder={t?.payments?.emailPlaceholder || 'your.email@example.com'}
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {t?.payments?.emailHint || 'We will send your receipt and access details to this email'}
              </p>
            </div>

            {/* Discount Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t?.payments?.discountCode?.label || 'Discount Code'}
              </label>
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
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950/20 dark:border-green-900">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800 dark:text-green-400">{appliedDiscount.code}</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400">
                      {appliedDiscount.type === 'percentage' 
                        ? `${appliedDiscount.value}% ${t?.payments?.discountCode?.off || 'off'}`
                        : `€${(appliedDiscount.value / 100).toFixed(0)} ${t?.payments?.discountCode?.off || 'off'}`
                      }
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={removeDiscount}>
                    {t?.payments?.discountCode?.remove || 'Remove'}
                  </Button>
                </div>
              )}
            </div>

            {/* Payment Summary */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>{getPackageTitle(selectedPackage)}</span>
                <span>{formatPrice(baseAmount)}</span>
              </div>
              
              {appliedDiscount && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>{t?.payments?.summary?.discount || 'Discount'}</span>
                  <span>-{formatPrice(appliedDiscount.discountAmount)}</span>
                </div>
              )}
              
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>{t?.payments?.summary?.total || 'Total'}</span>
                  <span className="text-primary">{formatPrice(finalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              disabled={isProcessingPayment || !selectedPackage || !guestEmail || !isValidEmail(guestEmail)}
              className="w-full py-6 text-lg"
              size="lg"
            >
              {isProcessingPayment
                ? (t?.payments?.summary?.processing || 'Processing...')
                : (t?.payments?.summary?.proceedToPayment || 'Proceed to Payment')
              }
            </Button>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>{t?.payments?.secure || 'Secure Payment'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{t?.payments?.support || '24h Support'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{t?.payments?.trusted || 'Trusted by 1000+'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fallback Dialog for Safari popup blocker */}
      <Dialog open={showFallbackDialog} onOpenChange={setShowFallbackDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t?.payments?.popupBlocked?.title || 'Open Payment Page'}
            </DialogTitle>
            <DialogDescription>
              {t?.payments?.popupBlocked?.description || 'Click the button below to open the payment page.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-4">
            <Button onClick={handleFallbackClick} className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              {t?.payments?.popupBlocked?.openPayment || 'Open Payment Page'}
            </Button>
            <Button variant="outline" onClick={() => setShowFallbackDialog(false)}>
              {t?.payments?.popupBlocked?.cancel || 'Cancel'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentFlow;
