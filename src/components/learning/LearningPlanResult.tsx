import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Clock, Award, BookOpen, MessageCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { countries, courseDurations } from '@/data/learningData';
import type { WizardData } from './LearningWizard';

interface LearningPlanResultProps {
  wizardData: WizardData;
  onReset: () => void;
  onConsultation: () => void;
}

const LearningPlanResult: React.FC<LearningPlanResultProps> = ({
  wizardData,
  onReset,
  onConsultation
}) => {
  const { t, currentLanguage: language } = useLanguage();
  const navigate = useNavigate();
  
  const selectedCountry = countries.find(c => c.id === wizardData.country);
  
  if (!selectedCountry) return null;

  const getDuration = () => {
    if (wizardData.level === 'fluent' || wizardData.level === 'unknown') {
      return courseDurations.fluent[language] || courseDurations.fluent.en;
    }
    return courseDurations[wizardData.level]?.[language] || courseDurations[wizardData.level]?.en || '';
  };

  const getRecommendedCourses = () => {
    const courses = [];
    
    if (wizardData.level !== 'fluent') {
      courses.push({
        title: t?.learning?.plan?.languageCourse || `${selectedCountry.language[language]} Language Course`,
        description: t?.learning?.plan?.languageCourseDesc || 'From your current level to professional proficiency',
        icon: BookOpen
      });
    }
    
    courses.push({
      title: t?.learning?.plan?.medicalTerminology || 'Medical Terminology',
      description: t?.learning?.plan?.medicalTerminologyDesc || 'Specialized vocabulary for clinical settings',
      icon: MessageCircle
    });

    if (selectedCountry.exams.length > 0) {
      courses.push({
        title: t?.learning?.plan?.examPrep || `${selectedCountry.exams[0]} Exam Preparation`,
        description: t?.learning?.plan?.examPrepDesc || 'Complete preparation for your medical license exam',
        icon: Award
      });
    }

    return courses;
  };

  const getIncludedFeatures = () => {
    return [
      t?.learning?.plan?.feature1 || 'Live online classes with native speakers',
      t?.learning?.plan?.feature2 || 'Self-paced learning modules',
      t?.learning?.plan?.feature3 || 'Real clinical case simulations',
      t?.learning?.plan?.feature4 || 'One-on-one mentoring sessions',
      t?.learning?.plan?.feature5 || 'Mock exams with feedback',
      t?.learning?.plan?.feature6 || 'Certificate upon completion'
    ];
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
          <Check className="w-5 h-5" />
          <span className="font-medium">
            {t?.learning?.plan?.planReady || 'Your personalized plan is ready!'}
          </span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          {t?.learning?.plan?.titlePrefix || 'Your Learning Plan for'}{' '}
          <span className="text-primary">
            {selectedCountry.flag} {selectedCountry.name[language] || selectedCountry.name.en}
          </span>
        </h2>
        
        <p className="text-lg text-muted-foreground">
          {t?.learning?.plan?.subtitle || `Learn ${selectedCountry.language[language]} and prepare for your medical career`}
        </p>
      </div>

      {/* Duration Card */}
      <Card className="mb-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {t?.learning?.plan?.estimatedDuration || 'Estimated Duration'}
                </p>
                <p className="text-2xl font-bold text-foreground">{getDuration()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {t?.learning?.plan?.requiredExams || 'Required Exams'}
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {selectedCountry.exams.join(', ')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Courses */}
      <h3 className="text-xl font-semibold mb-4 text-foreground">
        {t?.learning?.plan?.recommendedCourses || 'Recommended Courses'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {getRecommendedCourses().map((course, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <course.icon className="w-8 h-8 text-primary mb-3" />
              <h4 className="font-semibold text-foreground mb-1">{course.title}</h4>
              <p className="text-sm text-muted-foreground">{course.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Included Features */}
      <h3 className="text-xl font-semibold mb-4 text-foreground">
        {t?.learning?.plan?.whatIncluded || "What's Included"}
      </h3>
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {getIncludedFeatures().map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          onClick={onConsultation}
          className="flex items-center gap-2"
        >
          {t?.learning?.plan?.getFreeConsultation || 'Get Free Consultation'}
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => navigate('/homologation-payment')}
        >
          {t?.learning?.plan?.startHomologation || 'Start Homologation Process'}
        </Button>
      </div>

      <div className="text-center mt-6">
        <Button variant="ghost" onClick={onReset}>
          {t?.learning?.plan?.changePlan || '← Change my selections'}
        </Button>
      </div>
    </div>
  );
};

export default LearningPlanResult;
