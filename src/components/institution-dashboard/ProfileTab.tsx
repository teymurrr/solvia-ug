import React from 'react';
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkforceAnalyticsDashboard } from './workforce';
import { useLanguage } from '@/hooks/useLanguage';

interface ProfileTabProps {
  onEditProfile: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ onEditProfile }) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      {/* Hospital Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.institution.profile.title')}</CardTitle>
          <CardDescription>
            {t('dashboard.institution.profile.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="h-32 w-32 bg-muted rounded-lg flex items-center justify-center">
                <Building2 className="h-16 w-16 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">General Hospital</h2>
                <p className="text-medical-600">Hospital</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t('dashboard.institution.profile.email')}</h3>
                  <p>contact@hospital.com</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t('dashboard.institution.profile.website')}</h3>
                  <p>{t('dashboard.profile.notSpecified')}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t('dashboard.institution.profile.size')}</h3>
                  <p>{t('dashboard.profile.notSpecified')}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t('dashboard.institution.profile.location')}</h3>
                  <p>New York, USA</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">{t('dashboard.institution.profile.about')}</h3>
                <p className="text-muted-foreground">
                  {t('dashboard.institution.profile.incompleteProfile')}
                </p>
              </div>
              
              <Button variant="default" onClick={onEditProfile}>{t('dashboard.institution.profile.completeProfile')}</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workforce Analytics Dashboard */}
      <WorkforceAnalyticsDashboard />
    </div>
  );
};

export default ProfileTab;
