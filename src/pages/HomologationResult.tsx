import React, { useEffect, useRef, useState } from 'react';
import { trackPlanRevealed } from '@/lib/posthogEvents';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import Analytics from '@/utils/analyticsTracking';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  Calendar,
  FileText,
  Languages,
  GraduationCap,
  Lock,
  BadgeCheck,
  Users,
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
    Analytics.callBooked('result_page');
    window.open('https://calendly.com/david-rehrl-thesolvia/30min', '_blank');
  };

  const translatedCountryName = getCountryName(wizardData.targetCountry);

  const requiredLevel = countryData.languageRequirement.level;
  const monthlySalary = getMonthlySalaryLoss();
  const threeMonthSavings = (Number(monthlySalary) * 3).toLocaleString();
  const currency = countryData.averageSalaries.currency;

  // Summary line: "~9-12 months · 6 documents · B2 required"
  const summaryParts: string[] = [];
  const durationStr = `~${countryData.processTime.med} ${t.homologationResult.diagnosis?.monthsUnit || 'months'}`;
  summaryParts.push(durationStr);
  summaryParts.push(`${countryData.documents.length} ${t.homologationResult.diagnosis?.documentsLabel || 'documents'}`);
  if (showLanguageCard) {
    summaryParts.push(`${requiredLevel} ${t.homologationResult.language?.requiredLevel || 'required'}`);
  }

  // Roadmap: 2 unlocked + 1 locked teaser
  const unlockedSteps = [
    { icon: FileText, label: t.homologationResult.roadmap?.step1 || 'Document Collection & Verification', desc: t.homologationResult.roadmap?.step1desc || '' },
    ...(showLanguageCard ? [{ icon: Languages, label: t.homologationResult.roadmap?.step2 || 'Language Preparation', desc: (t.homologationResult.roadmap?.step2desc || '').replace('{level}', requiredLevel) }] : []),
  ];

  const lockedTeaser = { icon: GraduationCap, label: t.homologationResult.roadmap?.step4 || 'Exam Preparation', desc: '' };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
        
        {/* ===== HERO: Title + Savings Hook ===== */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-10 pb-2 md:pt-14 md:pb-4">

          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-1">
              {getCountryFlag(wizardData.targetCountry)} {t.homologationResult.pathTo} {translatedCountryName}
            </h1>

            {(wizardData.doctorType || wizardData.studyCountry) &&
              <p className="text-muted-foreground text-sm mb-5">
                {[getDoctorTypeLabel(wizardData.doctorType), wizardData.studyCountry ? `${t.homologationResult.from} ${wizardData.studyCountry}` : ''].filter(Boolean).join(' · ')}
              </p>
            }

            {/* Big savings number — the primary hook */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
              className="mb-4"
            >
              <div className="inline-block bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl px-8 py-5 shadow-lg shadow-primary/25">
                <p className="text-5xl md:text-6xl font-black tracking-tight leading-none">
                  {threeMonthSavings} {currency}
                </p>
                <p className="text-sm opacity-90 mt-1.5 font-medium">
                  {t.homologationResult.cta?.savingsMessage
                    || 'That\'s what you save by not losing 3 months doing it alone'}
                </p>
              </div>
            </motion.div>

            {/* Summary badges */}
            <div className="flex items-center justify-center gap-2 flex-wrap mt-3">
              {summaryParts.map((part, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold border border-primary/20 bg-primary/5 text-primary"
                >
                  {part}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ===== SINGLE CARD: Slim Roadmap + CTA ===== */}
        <div className="container mx-auto px-4 max-w-2xl pb-10 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border rounded-2xl overflow-hidden"
          >
            {/* Roadmap steps — max 3 */}
            <div className="px-4 py-4 space-y-2">
              {unlockedSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-background/50 border">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-primary/10 text-primary">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-[13px] leading-tight">{step.label}</h3>
                      <p className="text-xs text-muted-foreground leading-tight">{step.desc}</p>
                    </div>
                  </div>
                );
              })}

              {/* Single locked teaser */}
              <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg opacity-40">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-muted text-muted-foreground">
                  <Lock className="h-3 w-3" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-[13px] leading-tight text-muted-foreground">
                    {t.homologationResult.roadmap?.locked || 'Unlock your complete roadmap'}
                  </h3>
                </div>
              </div>
            </div>

            {/* CTA section */}
            <div className="px-5 pb-6 pt-3 space-y-3">
              {/* Social proof */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pb-1">
                <Users className="h-3.5 w-3.5" />
                <span>{t.homologationResult.cta?.socialProof || '500+ doctors have already started their journey with us'}</span>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Button
                  size="lg"
                  onClick={handleStartProcess}
                  className="gap-2 w-full text-lg h-14 font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
                >
                  {t.homologationResult.cta.startProcess} <ArrowRight className="h-5 w-5" />
                </Button>
              </motion.div>

              <Button
                size="lg"
                variant="outline"
                onClick={handleBookConsultation}
                className="gap-2 w-full h-12 border-2 border-primary/30 text-primary hover:bg-primary/5 font-semibold"
              >
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
