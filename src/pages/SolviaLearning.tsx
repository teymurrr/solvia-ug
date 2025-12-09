import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  LearningWizard,
  LearningPlanResult,
  CourseCatalog,
  CountryTestimonials,
  LearningFAQ,
  ValueProposition,
  ExamPrepSection,
  type WizardData
} from '@/components/learning';

const SolviaLearning = () => {
  const { t, currentLanguage: language } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialCountry = searchParams.get('country') || undefined;
  const [showPlan, setShowPlan] = useState(false);
  const [wizardData, setWizardData] = useState<WizardData | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const wizardRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to wizard if country is pre-selected
  useEffect(() => {
    if (initialCountry && wizardRef.current) {
      setTimeout(() => {
        wizardRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [initialCountry]);

  const [formData, setFormData] = useState({
    fullName: '',
    country: '',
    email: '',
    profession: '',
    germanLanguage: false,
    fspPreparation: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.country || !formData.email || !formData.profession) {
      toast.error(t?.learning?.form?.fillRequired || 'Please fill in all required fields');
      return;
    }

    if (!formData.germanLanguage && !formData.fspPreparation) {
      toast.error(t?.learning?.form?.selectInterest || 'Please select at least one area of interest');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('submit-learning-form', {
        body: formData
      });

      if (error) throw new Error(error.message || 'Failed to submit form');
      
      setIsSubmitted(true);
      toast.success(t?.learning?.form?.success || 'Thank you! Your form has been submitted successfully.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToWizard = () => {
    wizardRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWizardComplete = (data: WizardData) => {
    setWizardData(data);
    setShowPlan(true);
  };

  const handleResetPlan = () => {
    setShowPlan(false);
    setWizardData(null);
  };

  const getHeroTitle = () => {
    const titles: Record<string, string> = {
      es: 'Aprende el idioma médico que necesitas para trabajar en Europa',
      en: 'Learn the medical language you need to work in Europe',
      de: 'Lernen Sie die medizinische Sprache, die Sie für die Arbeit in Europa benötigen',
      fr: 'Apprenez la langue médicale dont vous avez besoin pour travailler en Europe',
      ru: 'Изучите медицинский язык, необходимый для работы в Европе'
    };
    return titles[language] || titles.en;
  };

  const getHeroSubtitle = () => {
    const subtitles: Record<string, string> = {
      es: 'Cursos especializados de alemán, francés, italiano y español médico, diseñados para profesionales de la salud internacionales.',
      en: 'Specialized German, French, Italian and Spanish medical courses designed for international healthcare professionals.',
      de: 'Spezialisierte medizinische Deutsch-, Französisch-, Italienisch- und Spanischkurse für internationale Gesundheitsfachkräfte.',
      fr: "Cours d'allemand, français, italien et espagnol médical spécialisés, conçus pour les professionnels de santé internationaux.",
      ru: 'Специализированные курсы медицинского немецкого, французского, итальянского и испанского языков для международных медицинских специалистов.'
    };
    return subtitles[language] || subtitles.en;
  };

  const getPrimaryCTA = () => {
    const ctas: Record<string, string> = {
      es: 'Crear mi Plan de Aprendizaje',
      en: 'Create My Learning Plan',
      de: 'Meinen Lernplan erstellen',
      fr: "Créer mon plan d'apprentissage",
      ru: 'Создать мой план обучения'
    };
    return ctas[language] || ctas.en;
  };

  const getSecondaryCTA = () => {
    const ctas: Record<string, string> = {
      es: 'Hablar con un asesor',
      en: 'Talk to an Advisor',
      de: 'Mit einem Berater sprechen',
      fr: 'Parler à un conseiller',
      ru: 'Поговорить с консультантом'
    };
    return ctas[language] || ctas.en;
  };

  const getFinalCTATitle = () => {
    const titles: Record<string, string> = {
      es: 'Empieza tu plan de idioma médico hoy',
      en: 'Start your medical language plan today',
      de: 'Beginnen Sie heute Ihren medizinischen Sprachplan',
      fr: "Commencez votre plan de langue médicale aujourd'hui",
      ru: 'Начните свой план медицинского языка сегодня'
    };
    return titles[language] || titles.en;
  };

  const getFinalCTASubtitle = () => {
    const subtitles: Record<string, string> = {
      es: 'Aprende el idioma que necesitas para trabajar en el país de tus sueños.',
      en: 'Learn the language you need to work in your dream country.',
      de: 'Lernen Sie die Sprache, die Sie brauchen, um in Ihrem Traumland zu arbeiten.',
      fr: 'Apprenez la langue dont vous avez besoin pour travailler dans le pays de vos rêves.',
      ru: 'Изучите язык, который вам нужен для работы в стране вашей мечты.'
    };
    return subtitles[language] || subtitles.en;
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-blue-50 to-background py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              {getHeroTitle()}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-3xl mx-auto">
              {getHeroSubtitle()}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={scrollToWizard}
                className="text-lg px-8 py-6"
              >
                {getPrimaryCTA()}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={scrollToForm}
                className="text-lg px-8 py-6"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                {getSecondaryCTA()}
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmMGY5ZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30 pointer-events-none"></div>
      </section>

      {/* Value Proposition */}
      <ValueProposition />

      {/* Learning Wizard Section */}
      <section ref={wizardRef} className="py-20 bg-background" id="wizard">
        <div className="container mx-auto px-4">
          {!showPlan ? (
            <LearningWizard onComplete={handleWizardComplete} initialCountry={initialCountry} />
          ) : (
            wizardData && (
              <LearningPlanResult 
                wizardData={wizardData}
                onReset={handleResetPlan}
                onConsultation={scrollToForm}
              />
            )
          )}
        </div>
      </section>

      {/* Course Catalog */}
      <CourseCatalog onSelectCourse={scrollToWizard} />

      {/* Exam Prep Section */}
      <ExamPrepSection onSelectCountry={scrollToWizard} />

      {/* Testimonials by Country */}
      <CountryTestimonials />

      {/* FAQ */}
      <LearningFAQ onTakeTest={scrollToWizard} />

      {/* Sign-Up Form Section */}
      <section ref={formRef} id="signup-form" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-xl border-none">
              <CardContent className="p-8">
                {!isSubmitted ? (
                  <>
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-foreground mb-4">
                        {t?.learning?.signupForm?.title || 'Get a Free Consultation'}
                      </h2>
                      <p className="text-muted-foreground">
                        {t?.learning?.signupForm?.subtitle || 'Fill the form and our team will contact you within 24 hours.'}
                      </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <Label htmlFor="fullName" className="text-sm font-medium">
                          {t?.learning?.signupForm?.fields?.fullName || 'Full Name'}
                        </Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          placeholder="Dr. María García"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country" className="text-sm font-medium">
                          {t?.learning?.signupForm?.fields?.country || 'Country of Residence'}
                        </Label>
                        <Input
                          id="country"
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          placeholder="Spain"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium">
                          {t?.learning?.signupForm?.fields?.email || 'Email'}
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="doctor@email.com"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="profession" className="text-sm font-medium">
                          {t?.learning?.signupForm?.fields?.profession || 'Your Profession'}
                        </Label>
                        <Input
                          id="profession"
                          value={formData.profession}
                          onChange={(e) => handleInputChange('profession', e.target.value)}
                          placeholder={t?.learning?.signupForm?.fields?.professionPlaceholder || 'e.g., Doctor, Nurse, Medical Student'}
                          className="mt-1"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">
                          {t?.learning?.signupForm?.interests?.title || 'What are you interested in?'}
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="germanLanguage"
                            checked={formData.germanLanguage}
                            onCheckedChange={(checked) => handleInputChange('germanLanguage', checked as boolean)}
                          />
                          <label htmlFor="germanLanguage" className="text-sm cursor-pointer">
                            {t?.learning?.signupForm?.interests?.germanLanguage || 'Medical Language Courses'}
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="fspPreparation"
                            checked={formData.fspPreparation}
                            onCheckedChange={(checked) => handleInputChange('fspPreparation', checked as boolean)}
                          />
                          <label htmlFor="fspPreparation" className="text-sm cursor-pointer">
                            {t?.learning?.signupForm?.interests?.fspPreparation || 'Exam Preparation (FSP, TELC, etc.)'}
                          </label>
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full py-6 text-lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting 
                          ? (t?.learning?.signupForm?.submitting || 'Submitting...') 
                          : (t?.learning?.signupForm?.submit || 'Submit')}
                      </Button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ArrowRight className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {t?.learning?.signupForm?.success?.title || 'Thank you!'}
                    </h3>
                    <p className="text-muted-foreground">
                      {t?.learning?.signupForm?.success?.message || 'Your form has been submitted successfully. We will contact you soon.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {getFinalCTATitle()}
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            {getFinalCTASubtitle()}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={scrollToWizard}
              className="text-lg px-8"
            >
              {getPrimaryCTA()}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={scrollToForm}
              className="text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              {getSecondaryCTA()}
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default SolviaLearning;
