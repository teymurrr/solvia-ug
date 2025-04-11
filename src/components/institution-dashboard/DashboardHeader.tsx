
import React from 'react';
import { Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  onEditProfile: () => void;
  onAddVacancy: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onEditProfile, onAddVacancy }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold">Institution Dashboard</h1>
        <p className="text-muted-foreground">Manage your hospital profile and job listings</p>
      </div>
      <div className="flex flex-col md:flex-row gap-2">
        <Button variant="outline" onClick={onEditProfile}>
          <Settings className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
        <Button onClick={onAddVacancy}>
          <Plus className="h-4 w-4 mr-2" />
          Post New Vacancy
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
