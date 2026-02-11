import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  Circle, 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap,
  ArrowRight,
  Sparkles,
  Globe
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

    const hasTargetCountry = !!profileData?.targetCountry;
    const hasExperience = (profileData?.experiences?.length || 0) > 0;
    const hasEducation = (profileData?.education?.length || 0) > 0;
    const hasLanguages = (profileData?.languages?.length || 0) > 0;
    const hasHomologation = paidCountries.length > 0;
    const hasExplored = savedVacanciesCount > 0 || appliedVacanciesCount > 0;

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
        id: 'country',
        label: (t as any)?.dashboard?.welcome?.checklistCountry || 'Set your target country',
        completed: hasTargetCountry,
        action: () => navigate('/homologation-wizard'),
        icon: <Globe className="w-4 h-4" />,
        priority: 4,
      },
      {
        id: 'homologation',
        label: hasHomologation
          ? ((t as any)?.dashboard?.welcome?.checklistUploadDocs || 'Upload your documents')
          : (t?.dashboard?.welcome?.checklistHomologation || 'Start your homologation process'),
        completed: hasHomologation && hasExplored, // simplified: paid + engaged
        action: hasHomologation
          ? () => navigate('/documents')
          : () => navigate('/homologation-wizard'),
        icon: <FileText className="w-4 h-4" />,
        priority: 5,
      },
      {
        id: 'vacancies',
        label: t?.dashboard?.welcome?.checklistVacancies || 'Explore job opportunities',
        completed: hasExplored,
        action: () => onTabChange('vacancies'),
        icon: <Briefcase className="w-4 h-4" />,
        priority: 6,
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
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
          {/* Progress Ring */}
          <div className="relative w-14 h-14 flex-shrink-0">
            <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
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
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
              {progressPercentage}%
            </span>
          </div>

          {/* Greeting */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold truncate">
              {getGreeting()}, {firstName}! 👋
            </h2>
            <p className="text-sm text-muted-foreground">
              {completedCount}/{totalCount} {t?.dashboard?.welcome?.stepsCompleted || 'steps completed'}
            </p>
          </div>

          {/* Primary CTA */}
          {nextAction && (
            <Button 
              onClick={nextAction.action} 
              className="gap-2 flex-shrink-0"
              size="sm"
            >
              {nextAction.icon}
              <span className="hidden sm:inline">{nextAction.label}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}

          {completedCount === totalCount && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">
                {t?.dashboard?.welcome?.allComplete || "You're all set!"}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeSection;
