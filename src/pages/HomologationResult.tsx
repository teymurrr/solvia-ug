import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Clock,
  Languages,
  ArrowRight,
  Calendar,
  AlertTriangle,
  FileText,
  GraduationCap,
  Lock,
  BadgeCheck,
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

  const lang = currentLanguage as HomologationLanguage || 'en';
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
        email: email || undefined
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
      </MainLayout>);
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
      </MainLayout>);
  }

  const getCountryFlag = (countryId: string) => {
    const flags: Record<string, string> = {
      germany: '🇩🇪', austria: '🇦🇹', spain: '🇪🇸', italy: '🇮🇹', france: '🇫🇷'
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
      'other': t.wizard?.doctorType?.other || 'Other'
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
    if (target === 'france' && frenchSpeakingCountries.includes(origin)) return false;
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
  const requiredLevelClean = requiredLevel.split('-')[0];
  const requiredIdx = languageLevels.indexOf(requiredLevelClean);
  const isMotherTongue = userLevel === 'MOTHER TONGUE' || wizardData.languageLevel?.toLowerCase() === 'mother tongue';
  const userIdx = languageLevels.indexOf(userLevel);
  const levelGap = isMotherTongue ? 0 : requiredIdx - userIdx;

  const monthlySalary = getMonthlySalaryLoss();

  // Roadmap steps — skip language step when user already speaks the target language
  const roadmapSteps = [
    { icon: FileText, label: t.homologationResult.roadmap?.step1 || 'Document Collection & Verification', desc: t.homologationResult.roadmap?.step1desc || '', locked: false },
    ...(showLanguageCard ? [{ icon: Languages, label: t.homologationResult.roadmap?.step2 || 'Language Preparation', desc: (t.homologationResult.roadmap?.step2desc || '').replace('{level}', requiredLevel), locked: false }] : []),
    { icon: FileText, label: t.homologationResult.roadmap?.step3 || 'Application Submission', desc: t.homologationResult.roadmap?.step3desc || '', locked: true },
    { icon: GraduationCap, label: t.homologationResult.roadmap?.step4 || 'Exam Preparation', desc: t.homologationResult.roadmap?.step4desc || '', locked: true },
    { icon: BadgeCheck, label: t.homologationResult.roadmap?.step5 || 'Final Approval & Registration', desc: t.homologationResult.roadmap?.step5desc || '', locked: true }
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
        
        {/* ===== HERO: Title + profile ===== */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-8 pb-4 md:pt-12 md:pb-6">

          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">
              {getCountryFlag(wizardData.targetCountry)} {t.homologationResult.pathTo} {translatedCountryName}
            </h1>

            {(wizardData.doctorType || wizardData.studyCountry) &&
              <p className="text-muted-foreground text-sm mb-3">
                {[getDoctorTypeLabel(wizardData.doctorType), wizardData.studyCountry ? `${t.homologationResult.from} ${wizardData.studyCountry}` : ''].filter(Boolean).join(' · ')}
              </p>
            }

            {/* Salary urgency */}
            <div className="inline-flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-4 py-2 rounded-full">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>
                {(t.homologationResult.urgency?.salaryLoss || "You are losing approximately {salary} {currency}/month by not working in {country}.")
                  .replace('{salary}', monthlySalary.toLocaleString())
                  .replace('{currency}', countryData.averageSalaries.currency)
                  .replace('{country}', translatedCountryName)}
              </span>
            </div>
          </div>
        </motion.section>

        {/* ===== SINGLE CARD: Diagnosis + Roadmap + CTA ===== */}
        <div className="container mx-auto px-4 max-w-2xl pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border rounded-2xl overflow-hidden"
          >
            {/* Diagnosis row */}
            <div className={`flex items-stretch ${showLanguageCard ? '' : ''} divide-x border-b`}>
              <div className="flex-1 py-4 px-3 text-center">
                <p className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground mb-1">
                  {t.homologationResult.diagnosis?.timeLabel || 'Duration'}
                </p>
                <p className="text-lg font-bold text-foreground">
                  {countryData.processTime.med} {t.homologationResult.diagnosis?.monthsUnit || dataTranslations.processTime?.months || 'months'}
                </p>
              </div>

              {showLanguageCard &&
                <div className="flex-1 py-4 px-3 text-center">
                  <p className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground mb-1">
                    {t.homologationResult.diagnosis?.languageLabel || 'Language'}
                  </p>
                  {levelGap > 0 ? (
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-base font-bold text-amber-600 dark:text-amber-400">{userLevel || '?'}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="text-base font-bold text-primary">{requiredLevel}</span>
                    </div>
                  ) : (
                    <p className="text-base font-bold text-green-600">✓ {requiredLevel}</p>
                  )}
                </div>
              }

              <div className="flex-1 py-4 px-3 text-center">
                <p className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground mb-1">
                  {t.homologationResult.diagnosis?.documentsLabel || 'Documents'}
                </p>
                <p className="text-lg font-bold text-foreground">{countryData.documents.length}</p>
              </div>
            </div>

            {/* Roadmap steps */}
            <div className="relative px-4 py-3">
              <div className="space-y-1">
                {roadmapSteps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={i} className={`flex items-center gap-3 py-2 px-3 rounded-lg ${
                      step.locked
                        ? 'opacity-30 blur-[1.5px]'
                        : 'bg-background/50 border'
                    }`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        step.locked
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {step.locked ? <Lock className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-[13px] leading-tight">{step.label}</h3>
                        {!step.locked && (
                          <p className="text-xs text-muted-foreground leading-tight">{step.desc}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Gradient fade over locked steps */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card via-card/80 to-transparent pointer-events-none" />
            </div>

            {/* CTA section */}
            <div className="px-5 pb-6 pt-2 space-y-3">
              <p className="text-center text-sm text-muted-foreground">
                {t.homologationResult.roadmap?.lockedDesc || 'Get detailed checklists, timelines, and expert guidance for each step'}
              </p>

              <Button size="lg" onClick={handleStartProcess} className="gap-2 w-full text-base">
                {t.homologationResult.cta.startProcess} <ArrowRight className="h-4 w-4" />
              </Button>

              <Button size="lg" variant="outline" onClick={handleBookConsultation} className="gap-2 w-full">
                <Calendar className="h-4 w-4" />
                {t.homologationResult.cta.bookConsultation}
              </Button>
            </div>
          </motion.div>

          {/* Email reminder */}
          {wizardData.email &&
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center text-sm text-muted-foreground mt-4">
              <p>{t.homologationResult.emailSent} <strong>{wizardData.email}</strong></p>
            </motion.div>
          }
        </div>
      </div>
    </MainLayout>
  );
};

export default HomologationResult;
