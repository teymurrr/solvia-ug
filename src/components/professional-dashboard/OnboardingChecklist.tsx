import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle2, 
  Circle, 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap,
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
}

interface OnboardingChecklistProps {
  profileData: ProfileFormValues | null;
  onEditProfile: () => void;
  savedVacanciesCount: number;
  appliedVacanciesCount: number;
  onTabChange: (tab: string) => void;
}

const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({
  profileData,
  onEditProfile,
  savedVacanciesCount,
  appliedVacanciesCount,
  onTabChange,
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { paidCountries } = usePaymentAccess();

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
      },
      {
        id: 'experience',
        label: t?.dashboard?.welcome?.checklistExperience || 'Add work experience & education',
        completed: hasExperience && hasEducation,
        action: onEditProfile,
        icon: <GraduationCap className="w-4 h-4" />,
      },
      {
        id: 'languages',
        label: t?.dashboard?.welcome?.checklistLanguages || 'Add your language skills',
        completed: hasLanguages,
        action: onEditProfile,
        icon: <Sparkles className="w-4 h-4" />,
      },
      {
        id: 'homologation',
        label: t?.dashboard?.welcome?.checklistHomologation || 'Start your homologation process',
        completed: hasHomologation,
        action: () => navigate('/homologation-wizard'),
        icon: <FileText className="w-4 h-4" />,
      },
      {
        id: 'vacancies',
        label: t?.dashboard?.welcome?.checklistVacancies || 'Explore job opportunities',
        completed: hasExplored,
        action: () => onTabChange('vacancies'),
        icon: <Briefcase className="w-4 h-4" />,
      },
    ];
  }, [profileData, savedVacanciesCount, appliedVacanciesCount, paidCountries, t, onEditProfile, onTabChange, navigate]);

  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;
  const incompleteItems = checklist.filter(item => !item.completed);

  if (completedCount === totalCount) return null;

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          {t?.dashboard?.welcome?.gettingStarted || 'Complete Your Profile'}
          <span className="text-sm font-normal text-muted-foreground ml-auto">
            {completedCount}/{totalCount}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {incompleteItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 bg-muted/50 hover:bg-muted cursor-pointer"
          >
            <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </CardContent>
    </Card>
  );
};

export default OnboardingChecklist;
