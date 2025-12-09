import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { countries, languageLevels, professions } from '@/data/learningData';
import { motion, AnimatePresence } from 'framer-motion';

interface LearningWizardProps {
  onComplete: (data: WizardData) => void;
}

export interface WizardData {
  country: string;
  level: string;
  profession: string;
}

const LearningWizard: React.FC<LearningWizardProps> = ({ onComplete }) => {
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    country: '',
    level: '',
    profession: ''
  });

  const handleCountrySelect = (countryId: string) => {
    setWizardData(prev => ({ ...prev, country: countryId }));
  };

  const handleLevelSelect = (levelId: string) => {
    setWizardData(prev => ({ ...prev, level: levelId }));
  };

  const handleProfessionSelect = (professionId: string) => {
    setWizardData(prev => ({ ...prev, profession: professionId }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(wizardData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return wizardData.country !== '';
      case 2: return wizardData.level !== '';
      case 3: return wizardData.profession !== '';
      default: return false;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return t?.learning?.wizard?.step1Title || 'Choose your destination country';
      case 2: return t?.learning?.wizard?.step2Title || 'What is your current language level?';
      case 3: return t?.learning?.wizard?.step3Title || 'What is your medical profession?';
      default: return '';
    }
  };

  const getLevelLabel = (levelId: string) => {
    const labels: Record<string, Record<string, string>> = {
      beginner: {
        es: 'Principiante (A1)',
        en: 'Beginner (A1)',
        de: 'Anfänger (A1)',
        fr: 'Débutant (A1)',
        ru: 'Начинающий (A1)'
      },
      intermediate: {
        es: 'Intermedio (A2-B1)',
        en: 'Intermediate (A2-B1)',
        de: 'Mittelstufe (A2-B1)',
        fr: 'Intermédiaire (A2-B1)',
        ru: 'Средний (A2-B1)'
      },
      advanced: {
        es: 'Avanzado (B2-C1)',
        en: 'Advanced (B2-C1)',
        de: 'Fortgeschritten (B2-C1)',
        fr: 'Avancé (B2-C1)',
        ru: 'Продвинутый (B2-C1)'
      },
      fluent: {
        es: 'Ya hablo el idioma',
        en: 'I already speak the language',
        de: 'Ich spreche die Sprache bereits',
        fr: 'Je parle déjà la langue',
        ru: 'Я уже говорю на языке'
      },
      unknown: {
        es: 'No sé mi nivel (test gratis)',
        en: "I don't know my level (free test)",
        de: 'Ich kenne mein Niveau nicht (kostenloser Test)',
        fr: 'Je ne connais pas mon niveau (test gratuit)',
        ru: 'Я не знаю свой уровень (бесплатный тест)'
      }
    };
    return labels[levelId]?.[language] || labels[levelId]?.en || levelId;
  };

  const getProfessionLabel = (professionKey: string) => {
    const labels: Record<string, Record<string, string>> = {
      generalPractitioner: {
        es: 'Médico General',
        en: 'General Practitioner',
        de: 'Allgemeinmediziner',
        fr: 'Médecin Généraliste',
        ru: 'Терапевт'
      },
      specialist: {
        es: 'Especialista',
        en: 'Specialist',
        de: 'Facharzt',
        fr: 'Spécialiste',
        ru: 'Специалист'
      },
      nurse: {
        es: 'Enfermería',
        en: 'Nurse',
        de: 'Pflegekraft',
        fr: 'Infirmier/ère',
        ru: 'Медсестра/Медбрат'
      },
      otherHealthcare: {
        es: 'Otros profesionales sanitarios',
        en: 'Other healthcare professionals',
        de: 'Andere Gesundheitsfachkräfte',
        fr: 'Autres professionnels de santé',
        ru: 'Другие медицинские специалисты'
      }
    };
    return labels[professionKey]?.[language] || labels[professionKey]?.en || professionKey;
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                s < step
                  ? 'bg-primary text-primary-foreground'
                  : s === step
                  ? 'bg-primary text-primary-foreground ring-4 ring-primary/30'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {s < step ? <Check className="w-5 h-5" /> : s}
            </div>
            {s < 3 && (
              <div
                className={`w-16 h-1 mx-2 rounded ${
                  s < step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step title */}
      <h3 className="text-2xl font-bold text-center mb-8 text-foreground">
        {getStepTitle()}
      </h3>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 1: Country Selection */}
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {countries.map((country) => (
                <Card
                  key={country.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    wizardData.country === country.id
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => handleCountrySelect(country.id)}
                >
                  <CardContent className="p-6 text-center">
                    <span className="text-5xl mb-3 block">{country.flag}</span>
                    <h4 className="font-semibold text-lg text-foreground">
                      {country.name[language] || country.name.en}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {country.language[language] || country.language.en}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Step 2: Language Level */}
          {step === 2 && (
            <div className="space-y-3">
              {languageLevels.map((level) => (
                <Card
                  key={level.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    wizardData.level === level.id
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => handleLevelSelect(level.id)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {level.id === 'unknown' && (
                        <HelpCircle className="w-5 h-5 text-primary" />
                      )}
                      <span className="font-medium text-foreground">
                        {getLevelLabel(level.id)}
                      </span>
                    </div>
                    {wizardData.level === level.id && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Step 3: Profession */}
          {step === 3 && (
            <div className="space-y-3">
              {professions.map((profession) => (
                <Card
                  key={profession.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    wizardData.profession === profession.id
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => handleProfessionSelect(profession.id)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <span className="font-medium text-foreground">
                      {getProfessionLabel(profession.key)}
                    </span>
                    {wizardData.profession === profession.id && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          {t?.learning?.wizard?.back || 'Back'}
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex items-center gap-2"
        >
          {step === 3
            ? t?.learning?.wizard?.seeMyPlan || 'See My Learning Plan'
            : t?.learning?.wizard?.next || 'Next'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default LearningWizard;
