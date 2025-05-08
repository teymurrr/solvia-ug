
import React from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getJobTypeBadgeVariant } from '@/components/vacancy/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface VacanciesTabProps {
  vacancies: any[];
  onAddVacancy: () => void;
  onDeleteVacancy: (id: string | number) => void;
  loading?: boolean;
}

const VacanciesTab: React.FC<VacanciesTabProps> = ({ 
  vacancies, 
  onAddVacancy, 
  onDeleteVacancy,
  loading = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Posted Vacancies</CardTitle>
        <CardDescription>
          Manage job listings and view applications
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onDeleteVacancy(vacancy.id)}
                    className="text-destructive hover:bg-destructive/10 ml-4"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            <Button onClick={onAddVacancy} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Post Another Vacancy
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No vacancies posted yet</h3>
            <p className="text-muted-foreground">
              Post your first job listing to attract healthcare professionals
            </p>
            <Button className="mt-4" onClick={onAddVacancy}>
              <Plus className="h-4 w-4 mr-2" />
              Post a Vacancy
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VacanciesTab;
