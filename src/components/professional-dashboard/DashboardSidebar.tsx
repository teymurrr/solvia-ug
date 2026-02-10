import React from 'react';
import LanguagePathCard from './LanguagePathCard';
import HomologationPreview from './HomologationPreview';
import CommunityWidget from './CommunityWidget';
import { ProfileFormValues } from '@/components/professional-profile/types';

interface DashboardSidebarProps {
  profileData: ProfileFormValues | null;
  showHomologationPreview: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  profileData,
  showHomologationPreview,
}) => {
  return (
    <div className="space-y-6 lg:sticky lg:top-24">
      <LanguagePathCard profileData={profileData} />
      {showHomologationPreview && (
        <HomologationPreview profileData={profileData} />
      )}
      <CommunityWidget userSpecialty={profileData?.specialty} compact />
    </div>
  );
};

export default DashboardSidebar;
