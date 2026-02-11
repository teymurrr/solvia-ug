import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  Languages, 
  CheckCircle2, 
  ArrowRight,
  Calendar,
  Sparkles,
  Shield,
  Users,
  HeartHandshake,
  AlertTriangle,
  FileText,
  GraduationCap,
  Lock,
  BadgeCheck,
  TrendingUp,
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

  const translatedCountryName = getCountryName(wizardData.targetCountry);

  // Language level calculations
  const languageLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const requiredLevel = countryData.languageRequirement.level;
  const userLevel = wizardData.languageLevel?.toUpperCase() || '';
  const requiredLevelClean = requiredLevel.split('-')[0]; // handle "B2-C1" -> B2
  const requiredIdx = languageLevels.indexOf(requiredLevelClean);
  const userIdx = languageLevels.indexOf(userLevel);
  const levelGap = requiredIdx - userIdx;

  const monthlySalary = getMonthlySalaryLoss();
  const investmentPercent = ((49 / Number(monthlySalary)) * 100).toFixed(1);

  // Roadmap steps
  const roadmapSteps = [
    { icon: FileText, label: t.homologationResult.roadmap?.step1 || 'Document Collection & Verification', desc: t.homologationResult.roadmap?.step1desc || '', locked: false },
    { icon: Languages, label: t.homologationResult.roadmap?.step2 || 'Language Preparation', desc: (t.homologationResult.roadmap?.step2desc || '').replace('{level}', requiredLevel), locked: false },
    { icon: FileText, label: t.homologationResult.roadmap?.step3 || 'Application Submission', desc: t.homologationResult.roadmap?.step3desc || '', locked: true },
    { icon: GraduationCap, label: t.homologationResult.roadmap?.step4 || 'Exam Preparation', desc: t.homologationResult.roadmap?.step4desc || '', locked: true },
    { icon: BadgeCheck, label: t.homologationResult.roadmap?.step5 || 'Final Approval & Registration', desc: t.homologationResult.roadmap?.step5desc || '', locked: true },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
        
        {/* ===== SECTION 1: HERO — Personalized diagnosis feel ===== */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-10 pb-6 md:pt-16 md:pb-10"
        >
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full mb-6 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              {t.homologationResult.diagnosis?.title || 'We analyzed your profile'}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              {getCountryFlag(wizardData.targetCountry)} {t.homologationResult.pathTo} {translatedCountryName}
            </h1>

            <p className="text-muted-foreground text-base md:text-lg mb-6 max-w-xl mx-auto">
              {(t.homologationResult.diagnosis?.subtitle || "Here's what stands between you and practicing medicine in {country}")
                .replace('{country}', translatedCountryName)}
            </p>

            {/* Salary urgency inline */}
            <div className="flex items-center justify-center gap-2 text-sm text-amber-700 dark:text-amber-400 mb-6">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>
                {(t.homologationResult.urgency?.salaryLoss || "You are losing approximately {salary} {currency}/month by not working in {country}.")
                  .replace('{salary}', monthlySalary.toLocaleString())
                  .replace('{currency}', countryData.averageSalaries.currency)
                  .replace('{country}', translatedCountryName)}
              </span>
            </div>

            {/* Profile pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {wizardData.doctorType && (
                <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  {getDoctorTypeLabel(wizardData.doctorType)}
                </span>
              )}
              {wizardData.studyCountry && (
                <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                  {t.homologationResult.from} {wizardData.studyCountry}
                </span>
              )}
            </div>
          </div>
        </motion.section>

        <div className="container mx-auto px-4 max-w-3xl space-y-6 pb-16">

          {/* ===== SECTION 2: DIAGNOSIS CARDS — At-a-glance gaps ===== */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Timeline card */}
              <div className="bg-card border rounded-2xl p-5 text-center space-y-2">
                <Clock className="h-5 w-5 text-primary mx-auto" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  {t.homologationResult.diagnosis?.timeLabel || 'Process Duration'}
                </p>
                <p className="text-2xl font-bold text-foreground">{countryData.processTime.med}</p>
                <p className="text-xs text-muted-foreground">
                  {t.homologationResult.timeline.bestCase}: {countryData.processTime.min}
                </p>
              </div>

              {/* Language gap card */}
              {showLanguageCard && (
                <div className="bg-card border rounded-2xl p-5 text-center space-y-2">
                  <Languages className="h-5 w-5 text-primary mx-auto" />
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    {t.homologationResult.diagnosis?.languageLabel || 'Language Gap'}
                  </p>
                  {levelGap > 0 ? (
                    <>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{userLevel || '?'}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <span className="text-lg font-bold text-primary">{requiredLevel}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {(t.homologationResult.diagnosis?.levelsToGo || '{count} levels to reach {target}')
                          .replace('{count}', String(levelGap))
                          .replace('{target}', requiredLevel)}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-bold text-green-600">✓ {requiredLevel}</p>
                      <p className="text-xs text-green-600">
                        {t.homologationResult.diagnosis?.languageReady || 'You meet the requirement!'}
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* Documents card */}
              <div className="bg-card border rounded-2xl p-5 text-center space-y-2">
                <FileText className="h-5 w-5 text-primary mx-auto" />
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  {t.homologationResult.diagnosis?.documentsLabel || 'Documents Needed'}
                </p>
                <p className="text-2xl font-bold text-foreground">{countryData.documents.length}</p>
                <p className="text-xs text-muted-foreground">
                  {(t.homologationResult.diagnosis?.documentsCount || '{count} documents to prepare')
                    .replace('{count}', String(countryData.documents.length))}
                </p>
              </div>
            </div>
          </motion.section>

          {/* ===== SECTION 3: ROADMAP — The key conversion element ===== */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-1">
                {t.homologationResult.roadmap?.title || 'Your Step-by-Step Roadmap'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t.homologationResult.roadmap?.subtitle || "We've created a personalized action plan based on your profile"}
              </p>
            </div>

            <div className="relative">
              {/* Steps */}
              <div className="space-y-0">
                {roadmapSteps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={i} className="relative">
                      {/* Connector line */}
                      {i < roadmapSteps.length - 1 && (
                        <div className={`absolute left-6 top-12 w-0.5 h-full ${step.locked ? 'bg-border' : 'bg-primary/30'}`} />
                      )}
                      <div className={`flex items-start gap-4 p-4 rounded-xl transition-all ${
                        step.locked 
                          ? 'opacity-40 blur-[1px]' 
                          : 'bg-card border'
                      }`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                          step.locked 
                            ? 'bg-muted text-muted-foreground' 
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {step.locked ? <Lock className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <h3 className="font-semibold text-sm">{step.label}</h3>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Gradient fade overlay on locked steps */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />

              {/* Unlock CTA overlay */}
              <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-2">
                <Button size="lg" onClick={handleStartProcess} className="gap-2 shadow-lg">
                  <Lock className="h-4 w-4" />
                  {t.homologationResult.roadmap?.locked || 'Unlock your complete roadmap'}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  {t.homologationResult.roadmap?.lockedDesc || 'Get detailed checklists, timelines, and expert guidance for each step'}
                </p>
              </div>
            </div>
          </motion.section>

          {/* ===== SECTION 4: PRICE CARD — Consolidated with trust + CTAs + guarantee ===== */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
              {t.homologationResult.value?.title || 'The smartest investment in your career'}
            </h2>

            <div className="bg-card border rounded-2xl p-6 md:p-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Left: What you'll earn */}
                <div className="text-center md:text-left space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {(t.homologationResult.value?.monthlyEarning || 'Your potential monthly salary in {country}')
                      .replace('{country}', translatedCountryName)}
                  </p>
                  <p className="text-3xl md:text-4xl font-bold text-primary">
                    {monthlySalary.toLocaleString()} {countryData.averageSalaries.currency}
                    <span className="text-base font-normal text-muted-foreground">/mo</span>
                  </p>
                </div>

                {/* Right: Your investment */}
                <div className="text-center md:text-right space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {t.homologationResult.value?.investmentLabel || 'Your investment to get there'}
                  </p>
                  <p className="text-3xl md:text-4xl font-bold text-foreground">
                    <span className="text-base font-normal text-muted-foreground">{t.homologationResult.value?.startingFrom || 'Starting from'} </span>
                    49€
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-2 text-sm justify-center">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-muted-foreground">
                  {(t.homologationResult.value?.returnNote || "That's less than {percent}% of your first month's salary")
                    .replace('{percent}', investmentPercent)}
                </span>
              </div>

              {/* Trust signals row */}
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  <span>{t.homologationResult.cta?.benefit1 || "Medical homologation experts"}</span>
                </div>
                <span className="hidden md:inline text-border">•</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  <span>{t.homologationResult.cta?.benefit2 || "98% success rate"}</span>
                </div>
                <span className="hidden md:inline text-border">•</span>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-blue-500" />
                  <span>{t.homologationResult.cta?.benefit3 || "24/7 support"}</span>
                </div>
                <span className="hidden md:inline text-border">•</span>
                <div className="flex items-center gap-1.5">
                  <HeartHandshake className="h-3.5 w-3.5 text-amber-500" />
                  <span>{t.homologationResult.cta?.benefit4 || "No hidden costs"}</span>
                </div>
              </div>

              <Separator />

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1 w-full">
                <Button size="lg" onClick={handleStartProcess} className="gap-2 w-full sm:flex-1">
                  {t.homologationResult.cta.startProcess} <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={handleBookConsultation} className="gap-2 w-full sm:flex-1">
                  <Calendar className="h-4 w-4" />
                  {t.homologationResult.cta.bookConsultation}
                </Button>
              </div>

              {/* Guarantee */}
              <p className="text-xs text-muted-foreground text-center">
                <Shield className="h-3 w-3 inline mr-1" />
                {t.homologationResult.value?.guaranteeDesc || "If you're not satisfied within 30 days, we'll refund your payment. No questions asked."}
              </p>
            </div>
          </motion.section>

          {/* Email reminder */}
          {wizardData.email && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
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
