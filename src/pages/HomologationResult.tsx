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
  Euro, 
  Languages, 
  CheckCircle2, 
  GraduationCap, 
  ArrowRight,
  Calendar,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { homologationDataByCountry, getProfessionSpecificInfo } from '@/data/homologationData';
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

  useEffect(() => {
    // Try to get data from URL params first, then localStorage
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
      // Fallback to localStorage
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
              <p className="text-muted-foreground mb-4">No data found. Please complete the wizard first.</p>
              <Button onClick={() => navigate('/homologation-wizard')}>Start Wizard</Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const countryData = homologationDataByCountry[wizardData.targetCountry];
  const professionInfo = getProfessionSpecificInfo(wizardData.targetCountry, wizardData.doctorType || 'general');

  if (!countryData) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">Country data not available.</p>
              <Button onClick={() => navigate('/homologation-wizard')}>Try Again</Button>
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

  const needsLanguageCourses = () => {
    const level = wizardData.languageLevel?.toLowerCase();
    if (!level) return true;
    if (level.includes('mother') || level.includes('mutter') || level.includes('matern')) return false;
    if (level === 'c1' || level === 'c2') return false;
    return true;
  };

  const handleStartProcess = () => {
    localStorage.setItem('wizardData', JSON.stringify(wizardData));
    navigate('/homologation-payment');
  };

  const handleBookConsultation = () => {
    window.open('https://calendly.com/david-rehrl-thesolvia/30min', '_blank');
  };

  const handleGermanClasses = () => {
    navigate('/solvia-learning');
  };

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
              <span className="text-sm font-medium">Your Personalized Plan</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {getCountryFlag(wizardData.targetCountry)} Your Path to {countryData.country}
            </h1>
            <p className="text-muted-foreground text-lg">
              {getDoctorTypeLabel(wizardData.doctorType)} • From {wizardData.studyCountry}
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Timeline Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Estimated Process Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-green-500/10 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{countryData.processTime.min}</p>
                      <p className="text-sm text-muted-foreground">Best Case</p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{countryData.processTime.med}</p>
                      <p className="text-sm text-muted-foreground">Average</p>
                    </div>
                    <div className="p-4 bg-orange-500/10 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{countryData.processTime.max}</p>
                      <p className="text-sm text-muted-foreground">Complex Cases</p>
                    </div>
                  </div>
                  {professionInfo && (
                    <p className="mt-4 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      <strong>Note:</strong> {professionInfo}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Cost Estimate Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Euro className="h-5 w-5 text-primary" />
                    Cost Expectations
                  </CardTitle>
                  <CardDescription>
                    Estimated total: {countryData.costEstimate.min.toLocaleString()}€ - {countryData.costEstimate.max.toLocaleString()}€
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {countryData.costEstimate.breakdown.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                        <span className="text-sm">{item.item}</span>
                        <Badge variant="secondary">{item.cost}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Language Requirement Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-primary" />
                    Language Requirement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Required Level</span>
                      <Badge className="text-lg px-4 py-1">{countryData.languageRequirement.level}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Your Level</span>
                      <Badge variant={needsLanguageCourses() ? "secondary" : "default"} className="text-lg px-4 py-1">
                        {wizardData.languageLevel || 'Not specified'}
                      </Badge>
                    </div>
                    <Separator />
                    <div>
                      <p className="font-medium mb-1">{countryData.languageRequirement.exam}</p>
                      <p className="text-sm text-muted-foreground">{countryData.languageRequirement.description}</p>
                    </div>
                    {needsLanguageCourses() && (
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                        <p className="text-sm text-amber-700 dark:text-amber-400">
                          Based on your current level, we recommend language preparation before starting the process.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Professional Exam Card */}
            {countryData.professionalExam && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      Professional Exam
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge variant="outline" className="text-base">
                        {countryData.professionalExam.name}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {countryData.professionalExam.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Document Checklist */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Document Checklist
                </CardTitle>
                <CardDescription>
                  Documents you'll need to prepare for your {countryData.country} application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {countryData.documents.map((doc, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 space-y-4"
          >
            {/* Primary CTA */}
            <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">Ready to Start Your Journey?</h3>
                    <p className="text-muted-foreground">
                      Get expert guidance through every step of your homologation process.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Button size="lg" onClick={handleStartProcess} className="gap-2">
                      Start My Process <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button size="lg" variant="outline" onClick={handleBookConsultation} className="gap-2">
                      <Calendar className="h-4 w-4" /> Book Free Consultation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* German Classes CTA (only for Germany/Austria) */}
            {countryData.showGermanClasses && needsLanguageCourses() && (
              <Card className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-yellow-500/10 border-amber-500/20">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-500/20 rounded-full">
                        <BookOpen className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-1">Need German Language Preparation?</h3>
                        <p className="text-sm text-muted-foreground">
                          Join our specialized German courses designed for medical professionals.
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="secondary" 
                      onClick={handleGermanClasses}
                      className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-400 gap-2"
                    >
                      <GraduationCap className="h-4 w-4" /> Explore German Classes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Email reminder notice */}
          {wizardData.email && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-center text-sm text-muted-foreground"
            >
              <p>A copy of this plan has been sent to <strong>{wizardData.email}</strong></p>
            </motion.div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default HomologationResult;
