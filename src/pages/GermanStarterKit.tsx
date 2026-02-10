import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Star, ArrowRight, FileText, Headphones, ClipboardList, Map, BookOpen, Shield, Clock, Users } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const PRICE_ID = 'price_1Sz4K32L7RuO91AuJfIRMC19';

const GermanStarterKit = () => {
  const { t, currentLanguage } = useLanguage();
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const sk = t?.learning?.starterKit;

  const handlePurchase = async () => {
    if (!email) {
      toast.error(sk?.emailRequired || 'Please enter your email');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-learning-payment', {
        body: {
          priceId: PRICE_ID,
          customerEmail: email,
          locale: currentLanguage,
        },
      });

      if (error) throw new Error(error.message);
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err: any) {
      toast.error(err.message || 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  const items = [
    { icon: BookOpen, text: sk?.item1 || '50 Essential Medical German Phrases (PDF)' },
    { icon: FileText, text: sk?.item2 || 'FSP Exam Structure & Timeline Guide (PDF)' },
    { icon: Map, text: sk?.item3 || 'Personal Roadmap: A1 to Approbation (PDF)' },
    { icon: Headphones, text: sk?.item4 || '10 Medical Term Pronunciation Audio Files' },
    { icon: ClipboardList, text: sk?.item5 || 'Document Checklist for Approbation' },
    { icon: Star, text: sk?.item6 || 'Bonus: Free 15-min Consultation Call' },
  ];

  const faqs = [
    {
      q: sk?.faq1q || 'What format are the materials?',
      a: sk?.faq1a || 'All materials are delivered as downloadable PDFs and MP3 audio files. You get instant access via email after purchase.',
    },
    {
      q: sk?.faq2q || 'Is this for doctors only?',
      a: sk?.faq2a || 'No! The Starter Kit is designed for all healthcare professionals — doctors, nurses, pharmacists, and medical students planning to work in Germany.',
    },
    {
      q: sk?.faq3q || 'Can I get a refund?',
      a: sk?.faq3a || 'Yes. We offer a full 30-day money-back guarantee, no questions asked.',
    },
  ];

  return (
    <MainLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                🇩🇪 {sk?.badge || 'Most Popular for Germany'}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                {sk?.heroTitle || 'Start Your Medical Career in Germany Today'}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {sk?.heroSubtitle || 'Get everything you need to take the first step — phrases, exam guides, roadmap, and a free consultation — for just €29.'}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {sk?.socialProof || '500+ professionals started here'}</span>
              </div>
            </div>

            {/* Purchase Card */}
            <Card className="shadow-xl border-primary/20">
              <CardContent className="p-6 space-y-5">
                <div className="text-center">
                  <span className="text-5xl font-bold text-foreground">€29</span>
                  <p className="text-sm text-muted-foreground mt-1">{sk?.oneTime || 'One-time payment'}</p>
                </div>

                <ul className="space-y-2">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{item.text}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="kit-email" className="text-sm font-medium">
                      {sk?.emailLabel || 'Your email (for instant delivery)'}
                    </Label>
                    <Input
                      id="kit-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="doctor@email.com"
                      className="mt-1"
                    />
                  </div>
                  <Button
                    size="lg"
                    className="w-full gap-2 text-lg py-6"
                    onClick={handlePurchase}
                    disabled={isLoading}
                  >
                    {isLoading
                      ? (sk?.processing || 'Processing...')
                      : (sk?.buyNow || 'Buy Now — €29')}
                    {!isLoading && <ArrowRight className="w-5 h-5" />}
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> {sk?.secure || 'Secure payment'}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {sk?.instant || 'Instant delivery'}</span>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  {sk?.guarantee || '30-day money-back guarantee'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
            {sk?.faqTitle || 'Frequently Asked Questions'}
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {sk?.finalCtaTitle || 'Ready to start your journey to Germany?'}
          </h2>
          <p className="text-lg opacity-90 mb-6 max-w-xl mx-auto">
            {sk?.finalCtaSubtitle || 'Get your Starter Kit now and take the first step today.'}
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8 gap-2"
            onClick={handlePurchase}
            disabled={isLoading}
          >
            {sk?.buyNow || 'Buy Now — €29'}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>
    </MainLayout>
  );
};

export default GermanStarterKit;
