import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Circle, 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ProfileFormValues } from '@/components/professional-profile/types';
import { useLanguage } from '@/hooks/useLanguage';
import { usePaymentAccess } from '@/hooks/usePaymentAccess';

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  action: () => void;
  icon: React.ReactNode;
  priority: number;
}

interface WelcomeSectionProps {
  profileData: ProfileFormValues | null;
  onEditProfile: () => void;
  savedVacanciesCount: number;
  appliedVacanciesCount: number;
  onTabChange: (tab: string) => void;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  profileData,
  onEditProfile,
  savedVacanciesCount,
  appliedVacanciesCount,
  onTabChange,
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { paidCountries } = usePaymentAccess();

  const firstName = profileData?.firstName || '';

  const checklist: ChecklistItem[] = useMemo(() => {
    const isProfileComplete = !!(
      profileData?.firstName &&
      profileData?.lastName &&
      profileData?.profession &&
      profileData?.location &&
      profileData?.about &&
      profileData?.profileImage
    );

    const hasExperience = (profileData?.experiences?.length || 0) > 0;
    const hasEducation = (profileData?.education?.length || 0) > 0;
    const hasLanguages = (profileData?.languages?.length || 0) > 0;
    const hasExplored = savedVacanciesCount > 0 || appliedVacanciesCount > 0;
    const hasHomologation = paidCountries.length > 0;

    return [
      {
        id: 'profile',
        label: t?.dashboard?.welcome?.checklistProfile || 'Complete your profile',
        completed: isProfileComplete,
        action: onEditProfile,
        icon: <User className="w-4 h-4" />,
        priority: 1,
      },
      {
        id: 'experience',
        label: t?.dashboard?.welcome?.checklistExperience || 'Add work experience & education',
        completed: hasExperience && hasEducation,
        action: onEditProfile,
        icon: <GraduationCap className="w-4 h-4" />,
        priority: 2,
      },
      {
        id: 'languages',
        label: t?.dashboard?.welcome?.checklistLanguages || 'Add your language skills',
        completed: hasLanguages,
        action: onEditProfile,
        icon: <Sparkles className="w-4 h-4" />,
        priority: 3,
      },
      {
        id: 'homologation',
        label: t?.dashboard?.welcome?.checklistHomologation || 'Start your homologation process',
        completed: hasHomologation,
        action: () => navigate('/homologation-wizard'),
        icon: <FileText className="w-4 h-4" />,
        priority: 4,
      },
      {
        id: 'vacancies',
        label: t?.dashboard?.welcome?.checklistVacancies || 'Explore job opportunities',
        completed: hasExplored,
        action: () => onTabChange('vacancies'),
        icon: <Briefcase className="w-4 h-4" />,
        priority: 5,
      },
    ];
  }, [profileData, savedVacanciesCount, appliedVacanciesCount, paidCountries, t, onEditProfile, onTabChange, navigate]);

  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  // Find the first incomplete item as the primary CTA
  const nextAction = checklist.find(item => !item.completed);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t?.dashboard?.welcome?.goodMorning || 'Good morning';
    if (hour < 18) return t?.dashboard?.welcome?.goodAfternoon || 'Good afternoon';
    return t?.dashboard?.welcome?.goodEvening || 'Good evening';
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Greeting + Progress */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold">
                {getGreeting()}, {firstName}! 👋
              </h2>
              <p className="text-muted-foreground mt-1">
                {t?.dashboard?.welcome?.subtitle || "Here's what you need to do to get started"}
              </p>
            </div>

            {/* Progress Ring */}
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="3"
                    strokeDasharray={`${progressPercentage}, 100`}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                  {progressPercentage}%
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">
                  {t?.dashboard?.welcome?.readiness || 'Your readiness'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {completedCount}/{totalCount} {t?.dashboard?.welcome?.stepsCompleted || 'steps completed'}
                </p>
              </div>
            </div>

            {/* Primary CTA */}
            {nextAction && (
              <Button 
                onClick={nextAction.action} 
                className="gap-2 w-full sm:w-auto"
                size="lg"
              >
                {nextAction.icon}
                {nextAction.label}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}

            {completedCount === totalCount && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">
                  {t?.dashboard?.welcome?.allComplete || "You're all set! Keep exploring opportunities."}
                </span>
              </div>
            )}
          </div>

          {/* Right: Checklist */}
          <div className="lg:w-80 space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              {t?.dashboard?.welcome?.gettingStarted || 'Getting Started'}
            </h3>
            {checklist.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 
                  ${item.completed 
                    ? 'bg-green-50 dark:bg-green-950/20 text-muted-foreground' 
                    : 'bg-muted/50 hover:bg-muted cursor-pointer'
                  }`}
              >
                {item.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                )}
                <span className={`text-sm ${item.completed ? 'line-through' : 'font-medium'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeSection;
