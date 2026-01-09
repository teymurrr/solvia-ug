import React from 'react';
import { Briefcase, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getJobTypeBadgeVariant } from '@/components/vacancy/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/hooks/useLanguage';

export interface VacanciesTabProps {
  vacancies: any[];
  onAddVacancy: () => void;
  onEditVacancy: (vacancy: any) => void;
  onDeleteVacancy: (id: string | number) => void;
  loading?: boolean;
  title?: string;
  description?: string;
  showAddButton?: boolean;
}

const VacanciesTab: React.FC<VacanciesTabProps> = ({ 
  vacancies, 
  onAddVacancy, 
  onEditVacancy,
  onDeleteVacancy,
  loading = false,
  title,
  description,
  showAddButton = true
}) => {
  const { t } = useLanguage();
  
  const displayTitle = title || t?.dashboard?.institution?.vacancies?.title || 'Your Vacancies';
  const displayDescription = description || t?.dashboard?.institution?.vacancies?.description || 'Manage your job postings';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{displayTitle}</CardTitle>
        <CardDescription>
          {displayDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ) : vacancies.length > 0 ? (
          <div className="space-y-4">
            {vacancies.map((vacancy) => (
              <div key={vacancy.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{vacancy.title}</h3>
                      <Badge variant={getJobTypeBadgeVariant(vacancy.job_type)} className="ml-2">
                        {vacancy.job_type || vacancy.contract_type}
                      </Badge>
                    </div>
                    <p className="text-sm text-medical-600">{vacancy.department}</p>
                    <p className="text-xs text-muted-foreground">{vacancy.location}</p>
                    
                    {vacancy.specialty && (
                      <span className="inline-flex text-xs bg-primary/10 text-primary rounded-full px-2 py-1 mr-1">
                        {vacancy.specialty}
                      </span>
                    )}
                    {vacancy.profession && (
                      <span className="inline-flex text-xs bg-primary/10 text-primary rounded-full px-2 py-1">
                        {vacancy.profession}
                      </span>
                    )}
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                      {vacancy.description}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEditVacancy(vacancy)}
                      className="text-primary hover:bg-primary/10"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      {t?.dashboard?.institution?.vacancies?.edit || 'Edit'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onDeleteVacancy(vacancy.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {t?.dashboard?.institution?.vacancies?.delete || 'Delete'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {showAddButton && (
              <Button onClick={onAddVacancy} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                {t?.dashboard?.institution?.vacancies?.postAnother || 'Post Another Vacancy'}
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">{t?.dashboard?.institution?.vacancies?.noVacancies || 'No vacancies yet'}</h3>
            <p className="text-muted-foreground">
              {t?.dashboard?.institution?.vacancies?.noVacanciesDesc || 'Post your first vacancy to start receiving applications'}
            </p>
            {showAddButton && (
              <Button className="mt-4" onClick={onAddVacancy}>
                <Plus className="h-4 w-4 mr-2" />
                {t?.dashboard?.institution?.vacancies?.postVacancy || 'Post Vacancy'}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VacanciesTab;
