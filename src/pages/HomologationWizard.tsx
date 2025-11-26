import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, Globe, Stethoscope, FileCheck, Languages, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

type WizardStep = 'welcome' | 'country' | 'study-country' | 'doctor-type' | 'documents' | 'language';

interface WizardData {
  targetCountry?: string;
  studyCountry?: string;
  doctorType?: 'general' | 'specialist' | 'nurse' | 'dentist' | 'other' | 'unsure';
  documentsReady?: 'yes' | 'no' | 'unsure';
  languageLevel?: string;
}

const HomologationWizard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<WizardStep>('welcome');
  const [wizardData, setWizardData] = useState<WizardData>({});

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

  const languageLevels = ['A1', 'A2', 'B1', 'B2', 'C1', "I don't know"];

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
    const completedData = { ...wizardData, languageLevel: level };
    setWizardData(completedData);
    console.log('Wizard completed:', completedData);
    // Navigate to dashboard or results page
    navigate('/professional-dashboard');
  };

  const handleBack = () => {
    const stepOrder: WizardStep[] = ['welcome', 'country', 'study-country', 'doctor-type', 'documents', 'language'];
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
                  Welcome. I will guide you step by step.
                </CardTitle>
                <CardDescription className="text-lg md:text-xl">
                  You don't need to know the process. Just answer a few easy questions.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center pb-8">
                <Button 
                  size="lg" 
                  onClick={handleStart}
                  className="text-lg px-12 py-6 h-auto"
                >
                  Start
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
                  Where do you want to work?
                </CardTitle>
                <CardDescription className="text-base md:text-lg">
                  Select your target country
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
                    <span className="font-medium">{country.name}</span>
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="w-full mt-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
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
                  In which country did you study medicine?
                </CardTitle>
                <CardDescription className="text-base md:text-lg">
                  Just choose one country
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select onValueChange={handleStudyCountrySelect}>
                  <SelectTrigger className="w-full h-12 text-lg">
                    <SelectValue placeholder="Select your country..." />
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
                  Back
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
                  Are you a general doctor or a specialist?
                </CardTitle>
                <CardDescription className="text-base md:text-lg">
                  Select your current status
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
                  Do you already have some of your documents ready?
                </CardTitle>
                <CardDescription className="text-base md:text-lg">
                  This helps us guide you better
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start text-lg h-auto py-4 hover:bg-primary/5 hover:border-primary transition-all"
                  onClick={() => handleDocumentsSelect('yes')}
                >
                  Yes, I have some
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start text-lg h-auto py-4 hover:bg-primary/5 hover:border-primary transition-all"
                  onClick={() => handleDocumentsSelect('no')}
                >
                  No, I need guidance
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start text-lg h-auto py-4 hover:bg-accent/5 hover:border-accent transition-all"
                  onClick={() => handleDocumentsSelect('unsure')}
                >
                  I have no idea
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="w-full mt-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
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
                  What is your current language level?
                </CardTitle>
                <CardDescription className="text-base md:text-lg">
                  For the country you want to work in
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {languageLevels.map((level) => (
                    <Button
                      key={level}
                      variant="outline"
                      size="lg"
                      className={`text-lg h-auto py-6 hover:bg-primary/5 hover:border-primary transition-all ${
                        level === "I don't know" ? 'col-span-2 md:col-span-3' : ''
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
                  Back
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
