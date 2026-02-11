import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
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
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { homologationDataByCountry } from '@/data/homologationData';
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
      germany: '🇩🇪', austria: '🇦🇹', spain: '🇪🇸', italy: '🇮🇹', france: '🇫🇷',
    };
    return flags[countryId] || '🌍';
  };

  const getCountryName = (countryId: string) => {
    return dataTranslations.countries[countryId as keyof typeof dataTranslations.countries] || countryData.country;
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

  const requiresForeignLanguage = () => {
    const target = wizardData.targetCountry?.toLowerCase();
    const origin = wizardData.studyCountry?.toLowerCase() || '';
    const spanishSpeakingCountries = ['spain', 'mexico', 'colombia', 'argentina', 'venezuela', 'peru', 'chile', 'ecuador', 'cuba', 'dominican republic', 'guatemala', 'honduras', 'el salvador', 'nicaragua', 'costa rica', 'panama', 'uruguay', 'paraguay', 'bolivia'];
    const frenchSpeakingCountries = ['france', 'belgium', 'canada', 'senegal', 'cameroon', 'ivory coast', 'morocco', 'tunisia', 'algeria', 'haiti'];
    const italianSpeakingCountries = ['italy'];
    const germanSpeakingCountries = ['germany', 'austria', 'switzerland'];
    if (target === 'spain' && spanishSpeakingCountries.includes(origin)) return false;
    if ((target === 'france') && frenchSpeakingCountries.includes(origin)) return false;
    if (target === 'italy' && italianSpeakingCountries.includes(origin)) return false;
    if ((target === 'germany' || target === 'austria') && germanSpeakingCountries.includes(origin)) return false;
    return true;
  };

  const needsLanguagePrep = () => {
    if (!requiresForeignLanguage()) return false;
    const level = wizardData.languageLevel?.toLowerCase();
    if (!level) return true;
    if (level.includes('mother') || level.includes('mutter') || level.includes('matern') || level.includes('nativ')) return false;
    if (level === 'b2' || level === 'c1' || level === 'c2') return false;
    return true;
  };

  const showLanguageCard = requiresForeignLanguage();

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

  // Language level scale
  const languageLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const requiredLevel = countryData.languageRequirement.level;
  const userLevel = wizardData.languageLevel?.toUpperCase() || '';
  const requiredIdx = languageLevels.indexOf(requiredLevel);
  const userIdx = languageLevels.indexOf(userLevel);

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-10 pb-8 md:pt-16 md:pb-12"
        >
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full mb-5 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              {t.homologationResult.yourPlan}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              {getCountryFlag(wizardData.targetCountry)} {t.homologationResult.pathTo} {translatedCountryName}
            </h1>

            {/* Profile pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              {wizardData.doctorType && (
                <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                  {getDoctorTypeLabel(wizardData.doctorType)}
                </span>
              )}
              {wizardData.studyCountry && (
                <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                  {t.homologationResult.from} {wizardData.studyCountry}
                </span>
              )}
            </div>

            {/* Integrated urgency callout */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-300/40 dark:border-amber-700/40 text-amber-700 dark:text-amber-400 px-4 py-2 rounded-lg text-sm"
            >
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>
                {(t.homologationResult.urgency?.salaryLoss || "You are losing approximately {salary} {currency}/month by not working in {country}.")
                  .replace('{salary}', getMonthlySalaryLoss().toLocaleString())
                  .replace('{currency}', countryData.averageSalaries.currency)
                  .replace('{country}', translatedCountryName)}
              </span>
            </motion.div>
          </div>
        </motion.section>

        {/* Main Content */}
        <div className="container mx-auto px-4 max-w-4xl space-y-10 pb-16">
          {/* Timeline Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{t.homologationResult.timeline.title}</h2>
            </div>
            <div className="bg-card border rounded-2xl p-6 md:p-8">
              {/* Step indicator style */}
              <div className="flex items-center justify-between relative">
                {/* Connecting line */}
                <div className="absolute top-5 left-[16.66%] right-[16.66%] h-0.5 bg-border" />
                <div className="absolute top-5 left-[16.66%] h-0.5 bg-gradient-to-r from-green-500 via-primary to-orange-500" style={{ width: '66.66%' }} />

                {/* Best case */}
                <div className="flex-1 flex flex-col items-center relative z-10">
                  <div className="w-10 h-10 rounded-full bg-green-500/15 border-2 border-green-500 flex items-center justify-center mb-3">
                    <span className="text-sm font-bold text-green-600">{countryData.processTime.min}</span>
                  </div>
                  <span className="text-xs text-muted-foreground text-center">{t.homologationResult.timeline.bestCase}</span>
                </div>

                {/* Average */}
                <div className="flex-1 flex flex-col items-center relative z-10">
                  <div className="w-10 h-10 rounded-full bg-primary/15 border-2 border-primary flex items-center justify-center mb-3">
                    <span className="text-sm font-bold text-primary">{countryData.processTime.med}</span>
                  </div>
                  <span className="text-xs text-muted-foreground text-center">{t.homologationResult.timeline.average}</span>
                </div>

                {/* Complex */}
                <div className="flex-1 flex flex-col items-center relative z-10">
                  <div className="w-10 h-10 rounded-full bg-orange-500/15 border-2 border-orange-500 flex items-center justify-center mb-3">
                    <span className="text-sm font-bold text-orange-600">{countryData.processTime.max}</span>
                  </div>
                  <span className="text-xs text-muted-foreground text-center">{t.homologationResult.timeline.complexCases}</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Language Section */}
          {showLanguageCard && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Languages className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">{t.homologationResult.language.title}</h2>
              </div>
              <div className="bg-card border rounded-2xl p-6 md:p-8 space-y-6">
                {/* Visual A1–C2 scale */}
                <div>
                  <div className="flex justify-between mb-2">
                    {languageLevels.map((lvl, i) => {
                      const isRequired = i === requiredIdx;
                      const isUser = lvl === userLevel;
                      const isFilled = i <= requiredIdx;
                      return (
                        <div key={lvl} className="flex-1 flex flex-col items-center gap-1.5">
                          <div
                            className={`
                              w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                              ${isRequired ? 'bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-card' : ''}
                              ${isUser && !isRequired ? 'bg-amber-500 text-white ring-2 ring-amber-400/30 ring-offset-2 ring-offset-card' : ''}
                              ${!isRequired && !isUser && isFilled ? 'bg-primary/15 text-primary' : ''}
                              ${!isRequired && !isUser && !isFilled ? 'bg-muted text-muted-foreground' : ''}
                            `}
                          >
                            {lvl}
                          </div>
                          {isRequired && (
                            <span className="text-[10px] font-medium text-primary">{t.homologationResult.language.requiredLevel}</span>
                          )}
                          {isUser && !isRequired && (
                            <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">{t.homologationResult.language.yourLevel}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {/* Progress bar under the dots */}
                  <div className="flex gap-1 mt-3">
                    {languageLevels.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i <= (userIdx >= 0 ? userIdx : -1)
                            ? 'bg-amber-500'
                            : i <= requiredIdx
                            ? 'bg-primary/20'
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {needsLanguagePrep()
                      ? (t.homologationResult.language.recommendation || "Based on your current level, we recommend language preparation before starting the process.")
                      : (t.homologationResult.language.needHelp || "Need to reach this level?")}
                  </p>
                  <Button
                    onClick={needsLanguagePrep() ? handleLanguageLearning : handleStartHomologation}
                    className="gap-2"
                  >
                    {needsLanguagePrep()
                      ? (t.homologationResult.language.startLearning || "Start Learning")
                      : (t.homologationResult.cta.startProcess || "Start My Process")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.section>
          )}

          {/* Trust Bar */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-muted/50 rounded-2xl py-5 px-6">
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>{t.homologationResult.cta?.benefit1 || "Medical homologation experts"}</span>
                </div>
                <span className="hidden md:inline text-border">•</span>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>{t.homologationResult.cta?.benefit2 || "98% success rate"}</span>
                </div>
                <span className="hidden md:inline text-border">•</span>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span>{t.homologationResult.cta?.benefit3 || "24/7 support"}</span>
                </div>
                <span className="hidden md:inline text-border">•</span>
                <div className="flex items-center gap-2">
                  <HeartHandshake className="h-4 w-4 text-amber-500" />
                  <span>{t.homologationResult.cta?.benefit4 || "No hidden costs"}</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Bottom CTA */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center space-y-5"
          >
            <h3 className="text-2xl md:text-3xl font-bold">{t.homologationResult.cta.readyTitle}</h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t.homologationResult.cta.readyDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <Button size="lg" onClick={handleStartProcess} className="gap-2 flex-1">
                {t.homologationResult.cta.startProcess} <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={handleBookConsultation} className="gap-2 flex-1">
                <Calendar className="h-4 w-4" /> {t.homologationResult.cta.bookConsultation}
              </Button>
            </div>
          </motion.section>

          {/* Email reminder */}
          {wizardData.email && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-sm text-muted-foreground"
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
