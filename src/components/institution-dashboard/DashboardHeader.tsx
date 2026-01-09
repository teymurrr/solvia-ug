import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

interface DashboardHeaderProps {
  onAddVacancy: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onAddVacancy }) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold">{t('dashboard.institution.title')}</h1>
        <p className="text-muted-foreground">{t('dashboard.institution.subtitle')}</p>
      </div>
      <div className="flex flex-col md:flex-row gap-2">
        <Button onClick={onAddVacancy}>
          <Plus className="h-4 w-4 mr-2" />
          {t('dashboard.institution.postVacancy')}
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
