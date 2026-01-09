import React from 'react';
import { WorkforceAnalyticsDashboard } from './workforce';

interface ProfileTabProps {
  onEditProfile?: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = () => {
  return (
    <div className="space-y-6">
      {/* Workforce Analytics Dashboard - Main content */}
      <WorkforceAnalyticsDashboard />
    </div>
  );
};

export default ProfileTab;
