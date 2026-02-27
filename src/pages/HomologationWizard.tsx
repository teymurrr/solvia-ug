import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, Globe, Stethoscope, FileCheck, Languages, ArrowLeft, CheckCircle2 } from 'lucide-react';
import SEO from '@/components/SEO';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { saveWizardDataToProfile } from '@/services/wizardProfileService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Analytics from '@/utils/analyticsTracking';

type WizardStep = 'country' | 'study-country' | 'doctor-type' | 'language' | 'firstName' | 'lastName' | 'email' | 'summary' | 'password';

interface WizardData {
  targetCountry?: string;
  studyCountry?: string;
  doctorType?: 'general' | 'specialist' | 'nurse' | 'dentist' | 'other';
  documentsReady?: 'yes' | 'no' | 'unsure';
  languageLevel?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

const HomologationWizard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, isLoggedIn, signUp } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<WizardStep>('country');
  const [wizardData, setWizardData] = useState<WizardData>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);

  const [selectedTargetCountry, setSelectedTargetCountry] = useState<string | null>(null);

  const countries = [
    { id: 'germany', name: 'Germany', flag: '🇩🇪' },
    { id: 'austria', name: 'Austria', flag: '🇦🇹' },
    { id: 'spain', name: 'Spain', flag: '🇪🇸' },
    { id: 'italy', name: 'Italy', flag: '🇮🇹' },
    { id: 'france', name: 'France', flag: '🇫🇷' },
  ];

  const studyCountries = [
    'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria', 'Bangladesh', 'Belgium',
    'Bolivia', 'Brazil', 'Bulgaria', 'Canada', 'Chile', 'China', 'Colombia', 'Costa Rica', 'Croatia',
    'Cuba', 'Czech Republic', 'Denmark', 'Ecuador', 'Egypt', 'Finland', 'France', 'Germany', 'Greece',
    'Hungary', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan', 'Jordan',
    'Kenya', 'Lebanon', 'Mexico', 'Morocco', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway', 'Pakistan',
    'Peru', 'Philippines', 'Poland', 'Portugal', 'Romania', 'Russia', 'Saudi Arabia', 'Serbia', 'South Africa',
    'South Korea', 'Spain', 'Sweden', 'Switzerland', 'Syria', 'Thailand', 'Tunisia', 'Turkey', 'Ukraine',
    'United Kingdom', 'United States', 'Venezuela', 'Vietnam'
  ];

  const getLanguageLevels = () => [t?.wizard?.language?.motherTongue || 'Mother tongue', 'A1', 'A2', 'B1', 'B2', 'C1', t.wizard.language.dontKnow];

  const calculateEstimatedPrice = (targetCountry?: string): number => {
    if (targetCountry === 'spain') {
      return 250;
    }
    // Germany, Italy, France, Austria
    return 750;
  };

  const getDoctorTypeLabel = (type?: string) => {
    if (!type) return '';
    const mapping: Record<string, string> = {
      'general': t.wizard.doctorType.general,
      'specialist': t.wizard.doctorType.specialist,
      'nurse': t.wizard.doctorType.nurse,
      'dentist': t.wizard.doctorType.dentist,
      'other': t.wizard.doctorType.other,
      'unsure': t.wizard.doctorType.unsure
    };
    return mapping[type] || type;
  };

  const getCountryLabel = (countryId?: string) => {
    if (!countryId) return '';
    return t.wizard.countries[countryId as keyof typeof t.wizard.countries] || countryId;
  };

  const handleCountrySelect = (countryId: string) => {
     // Track country selection
     Analytics.countrySelected(countryId);
     
     setSelectedTargetCountry(countryId);
     setWizardData({ ...wizardData, targetCountry: countryId });
     setCurrentStep('study-country');
   };

  const handleStudyCountrySelect = (country: string) => {
    setWizardData({ ...wizardData, studyCountry: country });
    setCurrentStep('doctor-type');
  };

  const handleDoctorTypeSelect = (type: 'general' | 'specialist' | 'nurse' | 'dentist' | 'other') => {
    setWizardData({ ...wizardData, doctorType: type });
    setCurrentStep('language');
  };

  const handleLanguageSelect = (level: string) => {
    setWizardData({ ...wizardData, languageLevel: level });
    setCurrentStep('email');
  };

  const handleFirstNameSubmit = (firstName: string) => {
    setWizardData({ ...wizardData, firstName });
    setCurrentStep('lastName');
  };

  const handleLastNameSubmit = (lastName: string) => {
    setWizardData({ ...wizardData, lastName });
    setCurrentStep('email');
  };

  const handleEmailSubmit = async (email: string) => {
    // Prevent double submissions
    if (isSubmittingEmail) return;
    setIsSubmittingEmail(true);
    
    const updatedData = { ...wizardData, email };
    setWizardData(updatedData);
    
    // Capture lead data to database (with browser language for preferred_language)
    try {
      await supabase.functions.invoke('capture-lead', {
        body: {
          email,
          targetCountry: updatedData.targetCountry,
          studyCountry: updatedData.studyCountry,
          doctorType: updatedData.doctorType,
          languageLevel: updatedData.languageLevel,
          source: 'wizard',
          uiLanguage: localStorage.getItem('language') || 'en',
          browserLanguage: navigator.language || 'en',
        }
      });
      console.log('Lead captured successfully with browser language:', navigator.language);
    } catch (error) {
      console.error('Lead capture error:', error);
    }
    
    // Send personalized email with the plan
    try {
      await supabase.functions.invoke('send-homologation-plan', {
        body: {
          email,
          targetCountry: updatedData.targetCountry,
          doctorType: updatedData.doctorType,
          studyCountry: updatedData.studyCountry,
          languageLevel: updatedData.languageLevel,
          language: localStorage.getItem('language') || 'en',
          browserLanguage: navigator.language
        }
      });
      console.log('Homologation plan email sent successfully');
    } catch (error) {
      console.error('Email send error:', error);
    }
    
    // Store data and redirect to result page
    localStorage.setItem('wizardData', JSON.stringify(updatedData));
    navigate(`/homologation-result?country=${updatedData.targetCountry}&doctorType=${updatedData.doctorType}&studyCountry=${encodeURIComponent(updatedData.studyCountry || '')}&languageLevel=${encodeURIComponent(updatedData.languageLevel || '')}&email=${encodeURIComponent(email)}`);
  };

  const handleChoosePlan = () => {
    localStorage.setItem('wizardData', JSON.stringify(wizardData));
    navigate('/homologation-payment');
  };

  const handleBookConsultation = () => {
    window.open('https://calendly.com/david-rehrl-thesolvia/30min', '_blank');
  };

  const handlePasswordSubmit = async (password: string) => {
    const completedData = { ...wizardData, password };
    setWizardData(completedData);
    
    // Check if we have all required data
    if (!completedData.firstName || !completedData.lastName || !completedData.email || !password) {
      toast({
        title: t.common.error,
        description: "Missing required information",
        variant: "destructive",
      });
      return;
    }

    // Create account with all collected data
    setIsSaving(true);
    try {
      // First, create the user account with all wizard data in metadata
      await signUp(completedData.email, password, {
        first_name: completedData.firstName,
        last_name: completedData.lastName,
        user_type: 'professional',
        target_country: completedData.targetCountry,
        study_country: completedData.studyCountry,
        doctor_type: completedData.doctorType,
        documents_ready: completedData.documentsReady,
        language_level: completedData.languageLevel,
        preferred_language: localStorage.getItem('language') || 'en',
      });

      // Store email for confirmation page
      localStorage.setItem('pendingConfirmationEmail', completedData.email);

      toast({
        title: t.common.success,
        description: t.wizard.email.complete,
      });
      
      navigate('/confirm-email');
    } catch (error: any) {
      console.error('Signup error:', error);
      
      let errorMessage = 'An error occurred during signup.';
      const msg: string | undefined = error?.message;
      
      if (msg) {
        if (/over_email_send_rate_limit|rate limit|too many/i.test(msg)) {
          errorMessage = 'Too many signup attempts. Please wait 1–2 minutes, then try again.';
        } else if (/User already registered/i.test(msg)) {
          errorMessage = 'This email is already registered. Please try logging in instead.';
        } else {
          errorMessage = msg;
        }
      }
      
      toast({
        title: t.common.error,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    const stepOrder: WizardStep[] = ['country', 'study-country', 'doctor-type', 'language', 'email', 'summary', 'password'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const seoData = (t as any)?.seo?.homologation;

  return (
    <MainLayout>
      <SEO
        title={seoData?.title || 'Medical Degree Homologation in Europe – Approbation & Recognition'}
        description={seoData?.description || 'Step-by-step guide to getting your medical degree recognized in Europe.'}
        path="/homologation"
      />
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Country Selection - Target country only */}
          {currentStep === 'country' && (
            <Card className="border-2 shadow-xl animate-in fade-in-50 duration-500">
              <CardHeader className="text-center space-y-4 pb-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold">
                  {t.wizard.welcome.title}
                </CardTitle>
                <CardDescription className="text-base md:text-lg">
                  {t.wizard.welcome.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Target Country Question */}
                <div className="pt-2">
                  <h3 className="text-xl font-semibold text-center mb-4">
                    {t.wizard.targetCountry.title}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {countries.map((country) => (
                      <Button
                        key={country.id}
                        variant="outline"
                        size="lg"
                        className="flex flex-col items-center justify-center h-auto py-4 px-3 transition-all hover:bg-primary/5 hover:border-primary"
                        onClick={() => handleCountrySelect(country.id)}
                      >
                        <span className="text-3xl mb-2">{country.flag}</span>
                        <span className="font-medium text-sm">{t.wizard.countries[country.id as keyof typeof t.wizard.countries]}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Study Country Selection - Separate step */}
          {currentStep === 'study-country' && (
            <Card className="border-2 shadow-xl animate-in fade-in-50 duration-500">
              <CardHeader className="text-center space-y-2">
                <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-2">
                  <GraduationCap className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold">
                  {t.wizard.studyCountry.title}
                </CardTitle>
                <CardDescription className="text-base md:text-lg">
                  {t.wizard.studyCountry.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select onValueChange={handleStudyCountrySelect}>
                  <SelectTrigger className="w-full h-12 text-lg">
                    <SelectValue placeholder={t.wizard.studyCountry.placeholder} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {studyCountries.map((country) => (
                      <SelectItem key={country} value={country} className="text-lg">
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t.wizard.back}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Doctor Type Selection */}
          {currentStep === 'doctor-type' && (
            <Card className="border-2 shadow-xl animate-in fade-in-50 duration-500">
              <CardHeader className="text-center space-y-2">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Stethoscope className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold">
                  {t.wizard.doctorType.title}
                </CardTitle>
                <CardDescription className="text-base md:text-lg">
                  {t.wizard.doctorType.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start text-lg h-auto py-4 hover:bg-primary/5 hover:border-primary transition-all"
                  onClick={() => handleDoctorTypeSelect('general')}
                >
                  {t.wizard.doctorType.general}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start text-lg h-auto py-4 hover:bg-primary/5 hover:border-primary transition-all"
                  onClick={() => handleDoctorTypeSelect('specialist')}
                >
                  {t.wizard.doctorType.specialist}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start text-lg h-auto py-4 hover:bg-primary/5 hover:border-primary transition-all"
                  onClick={() => handleDoctorTypeSelect('nurse')}
                >
                  {t.wizard.doctorType.nurse}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start text-lg h-auto py-4 hover:bg-primary/5 hover:border-primary transition-all"
                  onClick={() => handleDoctorTypeSelect('dentist')}
                >
                  {t.wizard.doctorType.dentist}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start text-lg h-auto py-4 hover:bg-primary/5 hover:border-primary transition-all"
                  onClick={() => handleDoctorTypeSelect('other')}
                >
                  {t.wizard.doctorType.other}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="w-full mt-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t.wizard.back}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Language Level */}
          {currentStep === 'language' && (
            <Card className="border-2 shadow-xl animate-in fade-in-50 duration-500">
              <CardHeader className="text-center space-y-2">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Languages className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold">
                  {t.wizard.language.title}
                </CardTitle>
                <CardDescription className="text-base md:text-lg">
                  {t.wizard.language.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {getLanguageLevels().map((level) => (
                    <Button
                      key={level}
                      variant="outline"
                      size="lg"
                      className={`text-lg h-auto py-6 hover:bg-primary/5 hover:border-primary transition-all ${
                        level === t.wizard.language.dontKnow ? 'col-span-2 md:col-span-3' : ''
                      }`}
                      onClick={() => handleLanguageSelect(level)}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t.wizard.back}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* First Name Collection */}
          {currentStep === 'firstName' && (
            <Card className="border-2 shadow-xl animate-in fade-in-50 duration-500">
              <CardHeader className="text-center space-y-2">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold">
                  {t.wizard.firstName.title}
                </CardTitle>
                <CardDescription className="text-base md:text-lg">
                  {t.wizard.firstName.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const firstName = formData.get('firstName') as string;
                  if (firstName) {
                    handleFirstNameSubmit(firstName);
                  }
                }}>
                  <input
                    type="text"
                    name="firstName"
                    required
                    placeholder={t.wizard.firstName.placeholder}
                    className="w-full h-12 px-4 text-lg border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full mt-4 text-lg h-auto py-4"
                  >
                    {t.wizard.firstName.continue}
                  </Button>
                </form>
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t.wizard.back}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Last Name Collection */}
          {currentStep === 'lastName' && (
            <Card className="border-2 shadow-xl animate-in fade-in-50 duration-500">
              <CardHeader className="text-center space-y-2">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold">
                  {t.wizard.lastName.title}
                </CardTitle>
                <CardDescription className="text-base md:text-lg">
                  {t.wizard.lastName.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const lastName = formData.get('lastName') as string;
                  if (lastName) {
                    handleLastNameSubmit(lastName);
                  }
                }}>
                  <input
                    type="text"
                    name="lastName"
                    required
                    placeholder={t.wizard.lastName.placeholder}
                    className="w-full h-12 px-4 text-lg border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full mt-4 text-lg h-auto py-4"
                  >
                    {t.wizard.lastName.continue}
                  </Button>
                </form>
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t.wizard.back}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Email Collection */}
          {currentStep === 'email' && (
            <Card className="border-2 shadow-xl animate-in fade-in-50 duration-500">
              <CardHeader className="text-center space-y-2">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold">
                  {t.wizard.email.title}
                </CardTitle>
                <CardDescription className="text-base md:text-lg">
                  {t.wizard.email.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const email = formData.get('email') as string;
                  if (email && email.includes('@')) {
                    handleEmailSubmit(email);
                  }
                }}>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder={t.wizard.email.placeholder}
                    className="w-full h-12 px-4 text-lg border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full mt-4 text-lg h-auto py-4"
                    disabled={isSubmittingEmail}
                  >
                    {isSubmittingEmail ? (t.common?.loading || 'Loading...') : t.wizard.email.generatePlan}
                  </Button>
                </form>
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t.wizard.back}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Summary Step */}
          {currentStep === 'summary' && (
            <Card className="border-2 shadow-xl animate-in fade-in-50 duration-500">
              <CardHeader className="text-center space-y-2">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold">
                  {t.wizard.summary?.title || 'Summary'}
                </CardTitle>
                <CardDescription className="text-base md:text-lg">
                  {t.wizard.summary?.subtitle || 'Review your information and choose how to continue'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Info Card */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-3 border border-border">
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground">{t.wizard.summary?.targetCountry || 'Target country'}</span>
                    <span className="font-medium">{getCountryLabel(wizardData.targetCountry)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground">{t.wizard.summary?.studyCountry || 'Study country'}</span>
                    <span className="font-medium">{wizardData.studyCountry}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground">{t.wizard.summary?.name || 'Name'}</span>
                    <span className="font-medium">{wizardData.firstName} {wizardData.lastName}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground">{t.wizard.summary?.professionalType || 'Professional type'}</span>
                    <span className="font-medium">{getDoctorTypeLabel(wizardData.doctorType)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-muted-foreground">{t.wizard.summary?.languageLevel || 'Language level'}</span>
                    <span className="font-medium">{wizardData.languageLevel}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-lg font-semibold">{t.wizard.summary?.estimatedPrice || 'Estimated price'}</span>
                    <span className="text-2xl font-bold text-primary">€{calculateEstimatedPrice(wizardData.targetCountry)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full text-lg h-auto py-4"
                    onClick={handleChoosePlan}
                  >
                    {t.wizard.summary?.choosePlan || 'Choose package'}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full text-lg h-auto py-4"
                    onClick={handleBookConsultation}
                  >
                    {t.wizard.summary?.bookConsultation || 'Book a free consultation'}
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t.wizard.back}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Password Collection */}
          {currentStep === 'password' && (
            <Card className="border-2 shadow-xl animate-in fade-in-50 duration-500">
              <CardHeader className="text-center space-y-2">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold">
                  {t.wizard.password.title}
                </CardTitle>
                <CardDescription className="text-base md:text-lg">
                  {t.wizard.password.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const password = formData.get('password') as string;
                  const confirmPassword = formData.get('confirmPassword') as string;
                  
                  if (password !== confirmPassword) {
                    toast({
                      title: t.common.error,
                      description: t.wizard.password.mismatch,
                      variant: "destructive",
                    });
                    return;
                  }
                  
                  if (password.length < 8) {
                    toast({
                      title: t.common.error,
                      description: t.wizard.password.tooShort,
                      variant: "destructive",
                    });
                    return;
                  }

                  if (!privacyConsent) {
                    toast({
                      title: t.common.error,
                      description: t.wizard.password.privacyError,
                      variant: "destructive",
                    });
                    return;
                  }
                  
                  handlePasswordSubmit(password);
                }}>
                  <div className="space-y-3">
                    <input
                      type="password"
                      name="password"
                      required
                      placeholder={t.wizard.password.placeholder}
                      className="w-full h-12 px-4 text-lg border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      placeholder={t.wizard.password.confirmPlaceholder}
                      className="w-full h-12 px-4 text-lg border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border border-border mt-4">
                    <input
                      type="checkbox"
                      id="privacy-consent"
                      checked={privacyConsent}
                      onChange={(e) => setPrivacyConsent(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-border"
                    />
                    <label htmlFor="privacy-consent" className="text-sm text-foreground cursor-pointer leading-relaxed">
                      {t.wizard.password.privacyConsent}{' '}
                      <a href="/privacy" target="_blank" className="text-primary underline hover:text-primary/80">
                        {t.wizard.password.privacyPolicy}
                      </a>
                      {' '}{t.wizard.password.and}{' '}
                      <a href="/terms" target="_blank" className="text-primary underline hover:text-primary/80">
                        {t.wizard.password.termsOfService}
                      </a>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full mt-4 text-lg h-auto py-4"
                    disabled={isSaving}
                  >
                    {isSaving ? t.wizard.password.creating : t.wizard.password.complete}
                  </Button>
                </form>
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t.wizard.back}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default HomologationWizard;
