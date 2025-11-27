import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, Globe, Stethoscope, FileCheck, Languages, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { saveWizardDataToProfile } from '@/services/wizardProfileService';
import { useToast } from '@/hooks/use-toast';

type WizardStep = 'welcome' | 'country' | 'study-country' | 'doctor-type' | 'documents' | 'language' | 'email';

interface WizardData {
  targetCountry?: string;
  studyCountry?: string;
  doctorType?: 'general' | 'specialist' | 'nurse' | 'dentist' | 'other' | 'unsure';
  documentsReady?: 'yes' | 'no' | 'unsure';
  languageLevel?: string;
  email?: string;
}

const HomologationWizard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<WizardStep>('welcome');
  const [wizardData, setWizardData] = useState<WizardData>({});
  const [isSaving, setIsSaving] = useState(false);

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

  const getLanguageLevels = () => ['A1', 'A2', 'B1', 'B2', 'C1', t.wizard.language.dontKnow];

  const handleStart = () => {
    setCurrentStep('country');
  };

  const handleCountrySelect = (countryId: string) => {
    setWizardData({ ...wizardData, targetCountry: countryId });
    setCurrentStep('study-country');
  };

  const handleStudyCountrySelect = (country: string) => {
    setWizardData({ ...wizardData, studyCountry: country });
    setCurrentStep('doctor-type');
  };

  const handleDoctorTypeSelect = (type: 'general' | 'specialist' | 'nurse' | 'dentist' | 'other' | 'unsure') => {
    setWizardData({ ...wizardData, doctorType: type });
    setCurrentStep('documents');
  };

  const handleDocumentsSelect = (status: 'yes' | 'no' | 'unsure') => {
    setWizardData({ ...wizardData, documentsReady: status });
    setCurrentStep('language');
  };

  const handleLanguageSelect = (level: string) => {
    setWizardData({ ...wizardData, languageLevel: level });
    setCurrentStep('email');
  };

  const handleEmailSubmit = async (email: string) => {
    const completedData = { ...wizardData, email };
    setWizardData(completedData);
    
    // Check if user is logged in
    if (!isLoggedIn || !user) {
      // Store wizard data in localStorage temporarily
      localStorage.setItem('pendingWizardData', JSON.stringify(completedData));
      
      toast({
        title: "Almost there!",
        description: "Complete your signup to save your preferences.",
      });
      
      // Navigate to signup with pre-filled data
      navigate('/signup/professional', { state: { wizardData: completedData } });
      return;
    }

    // Save wizard data to profile
    setIsSaving(true);
    try {
      const result = await saveWizardDataToProfile(user.id, completedData);
      
      if (result.success) {
        toast({
          title: "Profile updated!",
          description: "Your preferences have been saved to your profile.",
        });
        
        // Navigate to dashboard
        navigate('/dashboard/professional');
      } else {
        throw new Error('Failed to save wizard data');
      }
    } catch (error) {
      console.error('Error saving wizard data:', error);
      toast({
        title: "Error saving data",
        description: "There was an error saving your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    const stepOrder: WizardStep[] = ['welcome', 'country', 'study-country', 'doctor-type', 'documents', 'language', 'email'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Welcome Screen */}
          {currentStep === 'welcome' && (
            <Card className="border-2 shadow-xl animate-in fade-in-50 duration-500">
              <CardHeader className="text-center space-y-4 pb-8">
                <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-3xl md:text-4xl font-bold">
                  {t.wizard.welcome.title}
                </CardTitle>
                <CardDescription className="text-lg md:text-xl">
                  {t.wizard.welcome.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center pb-8">
                <Button 
                  size="lg" 
                  onClick={handleStart}
                  className="text-lg px-12 py-6 h-auto"
                >
                  {t.wizard.welcome.start}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Country Selection */}
          {currentStep === 'country' && (
            <Card className="border-2 shadow-xl animate-in fade-in-50 duration-500">
              <CardHeader className="text-center space-y-2">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold">
                  {t.wizard.targetCountry.title}
                </CardTitle>
                <CardDescription className="text-base md:text-lg">
                  {t.wizard.targetCountry.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {countries.map((country) => (
                  <Button
                    key={country.id}
                    variant="outline"
                    size="lg"
                    className="w-full justify-start text-lg h-auto py-4 hover:bg-primary/5 hover:border-primary transition-all"
                    onClick={() => handleCountrySelect(country.id)}
                  >
                    <span className="text-3xl mr-4">{country.flag}</span>
                    <span className="font-medium">{t.wizard.countries[country.id as keyof typeof t.wizard.countries]}</span>
                  </Button>
                ))}
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

          {/* Study Country Selection */}
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
                  variant="outline"
                  size="lg"
                  className="w-full justify-start text-lg h-auto py-4 hover:bg-accent/5 hover:border-accent transition-all"
                  onClick={() => handleDoctorTypeSelect('unsure')}
                >
                  {t.wizard.doctorType.unsure}
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

          {/* Documents Status */}
          {currentStep === 'documents' && (
            <Card className="border-2 shadow-xl animate-in fade-in-50 duration-500">
              <CardHeader className="text-center space-y-2">
                <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-2">
                  <FileCheck className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold">
                  {t.wizard.documents.title}
                </CardTitle>
                <CardDescription className="text-base md:text-lg">
                  {t.wizard.documents.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start text-lg h-auto py-4 hover:bg-primary/5 hover:border-primary transition-all"
                  onClick={() => handleDocumentsSelect('yes')}
                >
                  {t.wizard.documents.yes}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start text-lg h-auto py-4 hover:bg-primary/5 hover:border-primary transition-all"
                  onClick={() => handleDocumentsSelect('no')}
                >
                  {t.wizard.documents.no}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start text-lg h-auto py-4 hover:bg-accent/5 hover:border-accent transition-all"
                  onClick={() => handleDocumentsSelect('unsure')}
                >
                  {t.wizard.documents.unsure}
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
                  What's your email address?
                </CardTitle>
                <CardDescription className="text-base md:text-lg">
                  We'll use this to create your account and keep you updated
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
                    placeholder="your.email@example.com"
                    className="w-full h-12 px-4 text-lg border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full mt-4 text-lg h-auto py-4"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Processing...' : 'Complete'}
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
