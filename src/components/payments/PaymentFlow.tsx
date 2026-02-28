import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Check, Shield, Clock, BookOpen, Users, Star, ExternalLink, Zap, Timer, ShieldCheck, CreditCard, Inbox, Headphones, Calendar, Phone, MessageCircle } from 'lucide-react';
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

interface Pricing {
  price: number;
  introPrice: number;
}

const getPricingByCountry = (country: string | null): Record<ProductType, { price: number; introPrice: number }> => {
  const defaultPricing = {
    digital_starter: { price: 7900, introPrice: 3900 },
    complete: { price: 37900, introPrice: 18900 },
    personal_mentorship: { price: 89900, introPrice: 44900 },
  };

  if (!country) {
    return defaultPricing;
  }

  switch (country.toLowerCase()) {
    case 'germany':
      return defaultPricing;
    case 'austria':
      return defaultPricing;
    case 'spain':
      return defaultPricing;
    case 'italy':
      return defaultPricing;
    case 'france':
      return defaultPricing;
    default:
      return defaultPricing;
  }
};

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date('2026-02-28T23:59:59').getTime();
    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  if (timeLeft.days <= 0 && timeLeft.hours <= 0 && timeLeft.minutes <= 0 && timeLeft.seconds <= 0) return null;

  return (
    <span className="font-mono font-semibold">
      {timeLeft.days}d {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
    </span>
  );
};

// Social proof rotating quote component
const SocialProofStrip: React.FC<{ quotes: any[] }> = ({ quotes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!quotes || quotes.length <= 1) return;
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(id);
  }, [quotes]);

  if (!quotes || quotes.length === 0) return null;
  const quote = quotes[currentIndex];

  return (
    <div className="flex items-center justify-center gap-3 py-3 px-4 bg-muted/50 rounded-lg text-sm">
      <div className="flex gap-0.5 flex-shrink-0">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-muted-foreground italic truncate">
        "{quote.text}"
      </p>
      <span className="text-xs text-muted-foreground flex-shrink-0 font-medium">
        — {quote.author}, {quote.country}
      </span>
    </div>
  );
};

interface CountryNames {
  germany: string;
  austria: string;
  spain: string;
  italy: string;
  france: string;
}

interface LanguageNames {
  german: string;
  spanish: string;
  italian: string;
  french: string;
}

const getCountryDisplayName = (country: string | null, t: { wizard?: { countries?: CountryNames }, payments?: { languageNames?: LanguageNames } }): string => {
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

const getLanguageForCountry = (country: string | null, t: { wizard?: { countries?: CountryNames }, payments?: { languageNames?: LanguageNames } }): string => {
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    const wizardDataStr = localStorage.getItem('wizardData');
    if (wizardDataStr) {
      try {
        const wizardData = JSON.parse(wizardDataStr);
        setTargetCountry(wizardData.targetCountry || null);
        if (wizardData.email) {
          setGuestEmail(wizardData.email);
        }
      } catch (e) {
        console.error('Error parsing wizard data:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedPackage && paymentSummaryRef.current) {
      setTimeout(() => {
        paymentSummaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [selectedPackage]);

  const pricing = getPricingByCountry(targetCountry);

  const packages: PackageConfig[] = [
    {
      id: 'digital_starter',
      icon: <Shield className="w-8 h-8" />,
      price: pricing.digital_starter.price,
      introPrice: pricing.digital_starter.introPrice,
      features: t?.payments?.packages?.digitalStarter?.features || [
        'Step-by-step guidance for each document',
        'AI-powered document analysis & validation',
        'Country-specific document checklist & templates',
        'Apostille & translation instructions',
        'Medical CV template',
        'Email support (response within 72h)',
        'Progress tracking dashboard'
      ]
    },
    {
      id: 'complete',
      icon: <BookOpen className="w-8 h-8" />,
      price: pricing.complete.price,
      introPrice: pricing.complete.introPrice,
      popular: true,
      features: t?.payments?.packages?.complete?.features || [
        'Everything in Digital Homologation',
        'Personal expert review of every document before submission',
        'Direct communication with authorities on your behalf',
        'Application submission for you',
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
        'Everything in Full Personal Homologation',
        '12-month medical language course access',
        '4× live 1:1 sessions (60 min): document review, exam prep & interview coaching',
        'Dedicated case manager from start to finish',
        'In-person support for key appointments (where available)',
        'We handle all authority communication & paperwork',
        'Direct WhatsApp & phone support'
      ]
    }
  ];

  const getPackageTitle = (id: ProductType) => {
    const languageName = getLanguageForCountry(targetCountry, t);
    switch (id) {
      case 'digital_starter':
        return t?.payments?.packages?.digitalStarter?.title || 'Digital Homologation';
      case 'complete':
        return t?.payments?.packages?.complete?.titleBase || 'Full Personal Homologation';
      case 'personal_mentorship':
        const mentorBase = t?.payments?.packages?.personalMentorship?.titleBase || 'Full Homologation +';
        return `${mentorBase} ${languageName}`;
    }
  };

  const getPackageDescription = (id: ProductType) => {
    const languageName = getLanguageForCountry(targetCountry, t);
    switch (id) {
      case 'digital_starter':
        return t?.payments?.packages?.digitalStarter?.description || 'Prepare your documents independently with our digital guides';
      case 'complete':
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
    const baseAmount = selectedConfig?.price || 0;
    const finalAmount = appliedDiscount ? appliedDiscount.finalAmount : baseAmount;
    Analytics.paymentStarted(selectedPackage, finalAmount);
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
        if (preOpenedWindow) {
          const success = redirectPaymentWindow(preOpenedWindow, data.url);
          if (success) { onClose?.(); return; }
          setFallbackUrl(data.url);
          setShowFallbackDialog(true);
        } else if (isSafari()) {
          setFallbackUrl(data.url);
          setShowFallbackDialog(true);
        } else {
          window.open(data.url, '_blank');
          onClose?.();
        }
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      if (preOpenedWindow && !preOpenedWindow.closed) { preOpenedWindow.close(); }
      toast.error(error.message || t?.payments?.errors?.general || 'Payment processing failed');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleFallbackClick = () => {
    if (fallbackUrl) { window.location.href = fallbackUrl; }
  };

  const socialProofQuotes = t?.payments?.socialProofQuotes || [
    { text: 'Solvia made the whole process effortless — I got my Approbation in 7 months!', author: 'Dr. María L.', country: 'Spain' },
    { text: 'They handled everything with the authorities. I just focused on my German.', author: 'Dr. Luis F.', country: 'Mexico' },
    { text: 'The best investment I made for my medical career in Germany.', author: 'Dr. Ana R.', country: 'Colombia' },
  ];

  const whatHappensNextSteps = t?.payments?.whatHappensNext?.steps || [
    'Complete payment securely via Stripe',
    'Receive instant access to your dashboard',
    'Your dedicated team contacts you within 24h',
  ];

  const stepIcons = [
    <CreditCard className="w-4 h-4 text-primary flex-shrink-0" />,
    <Inbox className="w-4 h-4 text-primary flex-shrink-0" />,
    <Headphones className="w-4 h-4 text-primary flex-shrink-0" />,
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Country Indicator */}
      {targetCountry && (
        <div className="text-center">
          <Badge variant="secondary" className="text-base px-4 py-2">
            {getCountryFlag(targetCountry)} {t?.payments?.packagesFor || 'Packages for'} {getCountryDisplayName(targetCountry, t)}
          </Badge>
        </div>
      )}

      {/* 1. Single Urgency Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-primary/10 border border-primary/20 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <span className="font-semibold text-primary">
            {t?.payments?.limitedOffer || 'Limited introductory offer'}
          </span>
          <span className="text-sm font-medium">—</span>
          <span className="font-semibold text-primary">
            {t?.payments?.saveUpTo || 'Save up to 50%'}
          </span>
        </div>
        <div className="text-destructive">
          <CountdownTimer />
        </div>
      </div>

      {/* 4. Social Proof Row */}
      <SocialProofStrip quotes={socialProofQuotes} />

      {/* Pre-selection consultation CTA */}
      <div className="text-center py-3">
        <span className="text-muted-foreground text-sm">
          {t?.payments?.notSure || 'Not sure yet?'}{' '}
        </span>
        <a
          href="https://calendly.com/david-rehrl-thesolvia/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
        >
          <Calendar className="w-4 h-4" />
          {t?.payments?.bookConsultation || 'Book a free 15-min consultation'}
        </a>
      </div>

      {/* Package Selection */}
      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg flex flex-col ${
              selectedPackage === pkg.id
                ? 'border-primary ring-2 ring-primary/20 shadow-lg'
                : 'border-border hover:border-primary/50'
            } ${pkg.popular ? 'md:scale-[1.03] z-10' : ''}`}
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
              {/* 2. Savings Badge replaces per-card timer */}
              <div className="mb-6">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg text-muted-foreground line-through">{formatPrice(pkg.price)}</span>
                  <span className="text-4xl font-bold text-primary">{formatPrice(pkg.introPrice)}</span>
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none dark:bg-green-900/40 dark:text-green-400">
                    {t?.payments?.youSave || 'Save'} {Math.round(((pkg.price - pkg.introPrice) / pkg.price) * 100)}%
                  </Badge>
                </div>
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
              
              <div className="mt-auto pt-8">
                <Button
                  variant={selectedPackage === pkg.id ? 'default' : 'outline'}
                  className="w-full"
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>


      {/* 7. Trust Indicators (always visible) */}
      <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Shield className="w-4 h-4" />
          <span>{t?.payments?.secure || 'Secure Payment'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{t?.payments?.support || '24h Support'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          <span>{t?.payments?.trusted || 'Trusted by 500+'}</span>
        </div>
      </div>

      {/* Prominent Call CTA — Always visible */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-4 text-muted-foreground font-medium">
            {t?.payments?.callCta?.or || 'or'}
          </span>
        </div>
      </div>

      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <CardContent className="py-6 px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="w-7 h-7 text-primary" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-bold mb-1">
                {t?.payments?.callCta?.title || 'Prefer to talk to a real person?'}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {t?.payments?.callCta?.subtitle || 'Our medical homologation experts will answer all your questions and help you choose the right plan.'}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-primary" />
                  {t?.payments?.callCta?.benefit1 || 'No commitment required'}
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-primary" />
                  {t?.payments?.callCta?.benefit2 || 'Get personalized advice'}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5 text-primary" />
                  {t?.payments?.callCta?.benefit3 || 'Available in your language'}
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                asChild
              >
                <a href="https://calendly.com/david-rehrl-thesolvia/30min" target="_blank" rel="noopener noreferrer">
                  <Calendar className="w-5 h-5" />
                  {t?.payments?.callCta?.button || 'Schedule a Free Call'}
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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

            {/* 5. What Happens Next */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-semibold">
                {t?.payments?.whatHappensNext?.title || 'What happens next'}
              </h4>
              <div className="space-y-2.5">
                {whatHappensNextSteps.map((step: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {index + 1}
                    </div>
                    {stepIcons[index]}
                    <span className="text-sm text-muted-foreground">{step}</span>
                  </div>
                ))}
              </div>
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

            {/* 6. Alternative CTA */}
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="bg-muted/50 rounded-lg p-4 border border-border/50 text-center">
                <a
                  href="https://calendly.com/david-rehrl-thesolvia/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm transition-colors group"
                >
                  <span className="font-medium text-foreground">{t?.payments?.notSure || 'Not sure yet?'}</span>
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="text-primary font-medium underline underline-offset-2 group-hover:no-underline">
                    {t?.payments?.bookConsultation || 'Book a free 15-min consultation'}
                  </span>
                </a>
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
