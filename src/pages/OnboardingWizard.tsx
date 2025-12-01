import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, ArrowRight, CheckCircle2, MapPin, FileCheck, User, Globe, FileText, BookOpen, GraduationCap, CreditCard, Stamp, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type WizardStep = 'welcome' | 'targetCountry' | 'federalState' | 'currentLocation' | 'nameMatch' | 'diplomaApostilled' | 'documentsNeeded' | 'complete';

interface OnboardingData {
  targetCountry: string;
  federalState: string;
  currentLocation: string;
  nameMatchesDocuments: string;
  diplomaApostilled: string;
}

const GERMAN_STATES = [
  'Baden-Württemberg',
  'Bavaria (Bayern)',
  'Berlin',
  'Brandenburg',
  'Bremen',
  'Hamburg',
  'Hesse (Hessen)',
  'Lower Saxony (Niedersachsen)',
  'Mecklenburg-Vorpommern',
  'North Rhine-Westphalia (Nordrhein-Westfalen)',
  'Rhineland-Palatinate (Rheinland-Pfalz)',
  'Saarland',
  'Saxony (Sachsen)',
  'Saxony-Anhalt (Sachsen-Anhalt)',
  'Schleswig-Holstein',
  'Thuringia (Thüringen)'
];

const TARGET_COUNTRIES = [
  { value: 'germany', flag: '🇩🇪' },
  { value: 'austria', flag: '🇦🇹' },
  { value: 'spain', flag: '🇪🇸' },
  { value: 'italy', flag: '🇮🇹' },
  { value: 'france', flag: '🇫🇷' }
];

const OnboardingWizard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<WizardStep>('welcome');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    targetCountry: '',
    federalState: '',
    currentLocation: '',
    nameMatchesDocuments: '',
    diplomaApostilled: ''
  });

  const translations = t?.onboarding || {};

  const steps: WizardStep[] = ['welcome', 'targetCountry', 'federalState', 'currentLocation', 'nameMatch', 'diplomaApostilled', 'documentsNeeded', 'complete'];
  const currentIndex = steps.indexOf(currentStep);

  const goNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const goBack = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'welcome':
        return true;
      case 'targetCountry':
        return data.targetCountry !== '';
      case 'federalState':
        return true; // Optional
      case 'currentLocation':
        return data.currentLocation !== '';
      case 'nameMatch':
        return data.nameMatchesDocuments !== '';
      case 'diplomaApostilled':
        return data.diplomaApostilled !== '';
      case 'documentsNeeded':
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('clients')
        .insert({
          user_id: user?.id || null,
          email: user?.email || null,
          target_country: data.targetCountry,
          federal_state: data.federalState || null,
          current_location: data.currentLocation,
          name_matches_documents: data.nameMatchesDocuments,
          diploma_apostilled: data.diplomaApostilled
        });

      if (error) throw error;

      setCurrentStep('complete');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      toast({
        title: translations.error?.title || 'Error',
        description: translations.error?.description || 'Failed to save your information. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextOrSubmit = () => {
    if (currentStep === 'documentsNeeded') {
      handleSubmit();
    } else {
      goNext();
    }
  };

  const getCountryLabel = (value: string) => {
    return translations.countries?.[value] || value;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Globe className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                {translations.welcome?.title || "Let's start your homologation process."}
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {translations.welcome?.subtitle || "We'll ask you some simple questions to guide you step by step."}
              </p>
              <p className="text-sm text-muted-foreground">
                {translations.welcome?.note || "You don't need to know anything — Solvia does it for you."}
              </p>
            </div>
          </div>
        );

      case 'targetCountry':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <MapPin className="w-10 h-10 mx-auto text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                {translations.targetCountry?.title || 'Which country do you want to homologate in first?'}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {TARGET_COUNTRIES.map((country) => (
                <Button
                  key={country.value}
                  variant={data.targetCountry === country.value ? 'default' : 'outline'}
                  className="w-full justify-start text-left h-14 text-lg"
                  onClick={() => setData({ ...data, targetCountry: country.value })}
                >
                  <span className="text-2xl mr-3">{country.flag}</span>
                  {getCountryLabel(country.value)}
                </Button>
              ))}
            </div>
          </div>
        );

      case 'federalState':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <MapPin className="w-10 h-10 mx-auto text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                {translations.federalState?.title || 'Which federal state would you like to work in?'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {translations.federalState?.optional || '(Optional)'}
              </p>
            </div>
            <Select
              value={data.federalState}
              onValueChange={(value) => setData({ ...data, federalState: value })}
            >
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder={translations.federalState?.placeholder || 'Select a federal state...'} />
              </SelectTrigger>
              <SelectContent>
                {GERMAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground text-center">
              {translations.federalState?.skip || 'You can skip this step if you\'re not sure yet.'}
            </p>
          </div>
        );

      case 'currentLocation':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <MapPin className="w-10 h-10 mx-auto text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                {translations.currentLocation?.title || 'Where are you currently living?'}
              </h2>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentLocation">{translations.currentLocation?.label || 'Country / City'}</Label>
              <Input
                id="currentLocation"
                value={data.currentLocation}
                onChange={(e) => setData({ ...data, currentLocation: e.target.value })}
                placeholder={translations.currentLocation?.placeholder || 'e.g., Argentina, Buenos Aires'}
                className="h-12"
              />
            </div>
          </div>
        );

      case 'nameMatch':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <User className="w-10 h-10 mx-auto text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                {translations.nameMatch?.title || 'Does your name match exactly on all your documents?'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {translations.nameMatch?.subtitle || 'Passport, diploma, certificates, etc.'}
              </p>
            </div>
            <RadioGroup
              value={data.nameMatchesDocuments}
              onValueChange={(value) => setData({ ...data, nameMatchesDocuments: value })}
              className="space-y-3"
            >
              {['yes', 'no', 'not_sure'].map((option) => (
                <div
                  key={option}
                  className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                    data.nameMatchesDocuments === option 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setData({ ...data, nameMatchesDocuments: option })}
                >
                  <RadioGroupItem value={option} id={`name-${option}`} />
                  <Label htmlFor={`name-${option}`} className="cursor-pointer flex-1">
                    {translations.nameMatch?.[option] || option.replace('_', ' ').toUpperCase()}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'diplomaApostilled':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <FileCheck className="w-10 h-10 mx-auto text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                {translations.diplomaApostilled?.title || 'Is your diploma already apostilled?'}
              </h2>
            </div>
            <RadioGroup
              value={data.diplomaApostilled}
              onValueChange={(value) => setData({ ...data, diplomaApostilled: value })}
              className="space-y-3"
            >
              {['yes', 'no', 'dont_know'].map((option) => (
                <div
                  key={option}
                  className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                    data.diplomaApostilled === option 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setData({ ...data, diplomaApostilled: option })}
                >
                  <RadioGroupItem value={option} id={`diploma-${option}`} />
                  <Label htmlFor={`diploma-${option}`} className="cursor-pointer flex-1">
                    {translations.diplomaApostilled?.[option] || option.replace('_', ' ').toUpperCase()}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'documentsNeeded':
        const documents = [
          { icon: FileText, key: 'diploma' },
          { icon: BookOpen, key: 'academicRecords' },
          { icon: GraduationCap, key: 'curriculum' },
          { icon: CreditCard, key: 'passport' },
          { icon: Stamp, key: 'apostille' },
          { icon: Languages, key: 'languageCertificates' }
        ];
        
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <FileText className="w-10 h-10 mx-auto text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                {translations.documentsNeeded?.title || 'What we will need from you'}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {documents.map((doc) => {
                const Icon = doc.icon;
                return (
                  <div
                    key={doc.key}
                    className="flex items-center space-x-4 p-4 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground font-medium">
                      {translations.documentsNeeded?.[doc.key] || doc.key}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                {translations.complete?.title || 'Thank you!'}
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {translations.complete?.subtitle || 'We have received your information. Our team will contact you soon to start your homologation process.'}
              </p>
            </div>
            <Button onClick={() => navigate('/')} className="mt-4">
              {translations.complete?.backHome || 'Back to Home'}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  const progressPercentage = ((currentIndex) / (steps.length - 2)) * 100;

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background py-12 px-4">
        <div className="container mx-auto max-w-lg">
          {/* Progress bar */}
          {currentStep !== 'welcome' && currentStep !== 'complete' && (
            <div className="mb-8">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-sm text-muted-foreground text-center mt-2">
                {translations.step || 'Step'} {currentIndex} {translations.of || 'of'} {steps.length - 2}
              </p>
            </div>
          )}

          <Card className="shadow-lg">
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>

              {/* Navigation buttons */}
              {currentStep !== 'complete' && (
                <div className="flex justify-between mt-8 pt-6 border-t">
                  {currentStep !== 'welcome' ? (
                    <Button variant="outline" onClick={goBack}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {translations.back || 'Back'}
                    </Button>
                  ) : (
                    <div />
                  )}
                  
                  <Button 
                    onClick={handleNextOrSubmit}
                    disabled={!canProceed() || isSubmitting}
                  >
                    {isSubmitting ? (
                      translations.submitting || 'Submitting...'
                    ) : currentStep === 'documentsNeeded' ? (
                      translations.documentsNeeded?.understood || 'Understood → Continue'
                    ) : currentStep === 'welcome' ? (
                      translations.start || 'Start'
                    ) : (
                      <>
                        {translations.next || 'Next'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default OnboardingWizard;
