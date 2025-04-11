
import React from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface VacanciesTabProps {
  vacancies: any[];
  onAddVacancy: () => void;
  onDeleteVacancy: (id: number) => void;
}

const VacanciesTab: React.FC<VacanciesTabProps> = ({ 
  vacancies, 
  onAddVacancy, 
  onDeleteVacancy 
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
        {vacancies.length > 0 ? (
          <div className="space-y-4">
            {vacancies.map((vacancy) => (
              <div key={vacancy.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{vacancy.title}</h3>
                    <p className="text-sm text-medical-600">{vacancy.department}</p>
                    <p className="text-xs text-muted-foreground mt-1">{vacancy.location}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onDeleteVacancy(vacancy.id)}
                    className="text-destructive hover:bg-destructive/10"
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
