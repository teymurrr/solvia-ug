import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  FileText, 
  Languages, 
  CheckCircle2, 
  GraduationCap, 
  ArrowRight,
  Calendar,
  BookOpen,
  Sparkles,
  Shield,
  Users,
  HeartHandshake,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { homologationDataByCountry, getProfessionSpecificInfo } from '@/data/homologationData';
import { homologationTranslations, HomologationLanguage } from '@/data/homologationDataTranslations';
import { motion } from 'framer-motion';

interface WizardData {
  targetCountry?: string;
  studyCountry?: string;
  doctorType?: string;
  languageLevel?: string;
  email?: string;
}

const HomologationResult = () => {
  const { t, currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [wizardData, setWizardData] = useState<WizardData | null>(null);

  // Get translations for the current language
  const lang = (currentLanguage as HomologationLanguage) || 'en';
  const dataTranslations = homologationTranslations[lang] || homologationTranslations.en;

  useEffect(() => {
    const country = searchParams.get('country');
    const doctorType = searchParams.get('doctorType');
    const studyCountry = searchParams.get('studyCountry');
    const languageLevel = searchParams.get('languageLevel');
    const email = searchParams.get('email');

    if (country) {
      setWizardData({
        targetCountry: country,
        doctorType: doctorType || undefined,
        studyCountry: studyCountry || undefined,
        languageLevel: languageLevel || undefined,
        email: email || undefined,
      });
    } else {
      const stored = localStorage.getItem('wizardData');
      if (stored) {
        setWizardData(JSON.parse(stored));
      }
    }
  }, [searchParams]);

  if (!wizardData || !wizardData.targetCountry) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">{t.homologationResult.noData}</p>
              <Button onClick={() => navigate('/homologation-wizard')}>{t.homologationResult.startWizard}</Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const countryData = homologationDataByCountry[wizardData.targetCountry];
  const professionInfo = dataTranslations.professionNotes[wizardData.targetCountry as keyof typeof dataTranslations.professionNotes]?.[wizardData.doctorType as keyof typeof dataTranslations.professionNotes.germany] || '';

  if (!countryData) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">{t.homologationResult.countryNotAvailable}</p>
              <Button onClick={() => navigate('/homologation-wizard')}>{t.homologationResult.tryAgain}</Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const getCountryFlag = (countryId: string) => {
    const flags: Record<string, string> = {
      germany: '🇩🇪',
      austria: '🇦🇹',
      spain: '🇪🇸',
      italy: '🇮🇹',
      france: '🇫🇷',
    };
    return flags[countryId] || '🌍';
  };

  const getCountryName = (countryId: string) => {
    return dataTranslations.countries[countryId as keyof typeof dataTranslations.countries] || countryData.country;
  };

  const getLanguageDescription = (countryId: string) => {
    return dataTranslations.languageDescriptions[countryId as keyof typeof dataTranslations.languageDescriptions] || countryData.languageRequirement.description;
  };


  const getDoctorTypeLabel = (type?: string) => {
    if (!type) return '';
    const mapping: Record<string, string> = {
      'general': t.wizard?.doctorType?.general || 'General Practitioner',
      'specialist': t.wizard?.doctorType?.specialist || 'Specialist',
      'nurse': t.wizard?.doctorType?.nurse || 'Nurse',
      'dentist': t.wizard?.doctorType?.dentist || 'Dentist',
      'other': t.wizard?.doctorType?.other || 'Other',
    };
    return mapping[type] || type;
  };

  // Determine if the target country requires a foreign language for this user
  const requiresForeignLanguage = () => {
    const target = wizardData.targetCountry?.toLowerCase();
    const origin = wizardData.studyCountry?.toLowerCase() || '';
    
    // Spanish-speaking countries whose graduates likely speak Spanish natively
    const spanishSpeakingCountries = ['spain', 'mexico', 'colombia', 'argentina', 'venezuela', 'peru', 'chile', 'ecuador', 'cuba', 'dominican republic', 'guatemala', 'honduras', 'el salvador', 'nicaragua', 'costa rica', 'panama', 'uruguay', 'paraguay', 'bolivia'];
    const frenchSpeakingCountries = ['france', 'belgium', 'canada', 'senegal', 'cameroon', 'ivory coast', 'morocco', 'tunisia', 'algeria', 'haiti'];
    const italianSpeakingCountries = ['italy'];
    const germanSpeakingCountries = ['germany', 'austria', 'switzerland'];
    
    // If going to Spain and from a Spanish-speaking country → no foreign language needed
    if (target === 'spain' && spanishSpeakingCountries.includes(origin)) return false;
    if ((target === 'france') && frenchSpeakingCountries.includes(origin)) return false;
    if (target === 'italy' && italianSpeakingCountries.includes(origin)) return false;
    if ((target === 'germany' || target === 'austria') && germanSpeakingCountries.includes(origin)) return false;
    
    return true;
  };

  const needsLanguagePrep = () => {
    // If the target country language is the user's native language, no prep needed
    if (!requiresForeignLanguage()) return false;
    
    const level = wizardData.languageLevel?.toLowerCase();
    if (!level) return true; // Not specified = assume they need it
    if (level.includes('mother') || level.includes('mutter') || level.includes('matern') || level.includes('nativ')) return false;
    if (level === 'b2' || level === 'c1' || level === 'c2') return false;
    return true; // A1, A2, B1 = needs prep
  };

  const showLanguageCard = requiresForeignLanguage();

  // Get monthly salary loss based on profession
  const getMonthlySalaryLoss = () => {
    const salaries = countryData.averageSalaries;
    const doctorType = wizardData.doctorType as keyof typeof salaries || 'general';
    return salaries[doctorType] || salaries.general;
  };

  const handleStartProcess = () => {
    localStorage.setItem('wizardData', JSON.stringify(wizardData));
    navigate('/homologation-payment');
  };

  const handleBookConsultation = () => {
    window.open('https://calendly.com/david-rehrl-thesolvia/30min', '_blank');
  };

  const handleLanguageLearning = () => {
    navigate(`/learning?country=${wizardData.targetCountry}`);
  };

  const handleStartHomologation = () => {
    navigate(`/homologation-payment?country=${wizardData.targetCountry}`);
  };
  const translatedCountryName = getCountryName(wizardData.targetCountry);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background py-8 md:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">{t.homologationResult.yourPlan}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {getCountryFlag(wizardData.targetCountry)} {t.homologationResult.pathTo} {translatedCountryName}
            </h1>
            <p className="text-muted-foreground text-lg">
              {getDoctorTypeLabel(wizardData.doctorType)} • {t.homologationResult.from} {wizardData.studyCountry}
            </p>
          </motion.div>

          {/* Urgency Banner with Salary Loss */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-6"
          >
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center gap-4">
              <div className="p-2 bg-amber-500/30 rounded-full">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-amber-700 dark:text-amber-400">{t.homologationResult.urgency?.title || "Don't Wait Any Longer"}</p>
                <p className="text-sm text-muted-foreground">
                  {(t.homologationResult.urgency?.salaryLoss || "You are losing approximately {salary} {currency}/month by not working in {country}.")
                    .replace('{salary}', getMonthlySalaryLoss().toLocaleString())
                    .replace('{currency}', countryData.averageSalaries.currency)
                    .replace('{country}', translatedCountryName)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className={`grid ${showLanguageCard ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-2xl mx-auto'} gap-6`}>
            {/* Timeline Card with CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    {t.homologationResult.timeline.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-green-500/10 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{countryData.processTime.min}</p>
                      <p className="text-sm text-muted-foreground">{t.homologationResult.timeline.bestCase}</p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{countryData.processTime.med}</p>
                      <p className="text-sm text-muted-foreground">{t.homologationResult.timeline.average}</p>
                    </div>
                    <div className="p-4 bg-orange-500/10 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{countryData.processTime.max}</p>
                      <p className="text-sm text-muted-foreground">{t.homologationResult.timeline.complexCases}</p>
                    </div>
                  </div>
                  
                  {/* CTA inside card */}
                  <div className="pt-4 border-t text-center space-y-3">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                      <BookOpen className="h-4 w-4" />
                      {t.homologationResult.timeline.startNow || "Start Homologation Now"}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t.homologationResult.cta.readyDescription || "The homologation process is complex and full of potential pitfalls. One mistake can cost you months of delay."}
                    </p>
                    <Button 
                      onClick={handleStartHomologation}
                      className="w-full gap-2"
                    >
                      {t.homologationResult.cta.startProcess || "Start My Process"}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Language Requirement Card - only shown when target country requires foreign language */}
            {showLanguageCard && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full border-2 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-primary" />
                    {t.homologationResult.language.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t.homologationResult.language.requiredLevel}</span>
                    <Badge className="text-lg px-4 py-1">{countryData.languageRequirement.level}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t.homologationResult.language.yourLevel}</span>
                    <Badge variant={needsLanguagePrep() ? "secondary" : "default"} className="text-lg px-4 py-1">
                      {wizardData.languageLevel || t.homologationResult.language.notSpecified}
                    </Badge>
                  </div>
                  <Separator />
                  
                  {/* CTA inside card */}
                  <div className="pt-2 text-center space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {needsLanguagePrep() 
                        ? (t.homologationResult.language.recommendation || "Based on your current level, we recommend language preparation before starting the process.")
                        : (t.homologationResult.language.needHelp || "Need to reach this level?")
                      }
                    </p>
                    <Button 
                      onClick={needsLanguagePrep() ? handleLanguageLearning : handleStartHomologation}
                      className="w-full gap-2"
                    >
                      {needsLanguagePrep() 
                        ? (t.homologationResult.language.startLearning || "Start Learning")
                        : (t.homologationResult.cta.startProcess || "Start My Process")
                      }
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            )}

          </div>


          {/* Why Choose Us - Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card border rounded-lg p-4 text-center">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">{t.homologationResult.cta?.benefit1 || "Medical homologation experts"}</p>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium">{t.homologationResult.cta?.benefit2 || "98% success rate"}</p>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-medium">{t.homologationResult.cta?.benefit3 || "24/7 support"}</p>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <HeartHandshake className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                <p className="text-sm font-medium">{t.homologationResult.cta?.benefit4 || "No hidden costs"}</p>
              </div>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 space-y-4"
          >
            {/* Primary CTA */}
            <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-2 border-primary/30">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{t.homologationResult.cta.readyTitle}</h3>
                    <p className="text-muted-foreground max-w-2xl">
                      {t.homologationResult.cta.readyDescription}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                    <Button size="lg" onClick={handleStartProcess} className="gap-2 flex-1">
                      {t.homologationResult.cta.startProcess} <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button size="lg" variant="outline" onClick={handleBookConsultation} className="gap-2 flex-1">
                      <Calendar className="h-4 w-4" /> {t.homologationResult.cta.bookConsultation}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Email reminder notice */}
          {wizardData.email && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center text-sm text-muted-foreground"
            >
              <p>{t.homologationResult.emailSent} <strong>{wizardData.email}</strong></p>
            </motion.div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default HomologationResult;
