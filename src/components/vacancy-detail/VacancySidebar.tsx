
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

interface VacancySidebarProps {
  salary: string;
  postedDate: string;
  applicationDeadline: string;
  daysRemaining: number;
  isSaved: boolean;
  formatDate: (date: string) => string;
  onApply: () => void;
  onSaveVacancy: () => void;
}

const VacancySidebar: React.FC<VacancySidebarProps> = ({
  salary,
  postedDate,
  applicationDeadline,
  daysRemaining,
  isSaved,
  formatDate,
  onApply,
  onSaveVacancy,
}) => {
  return (
    <Card className="sticky top-20">
      <CardContent className="space-y-5 pt-6">
        {/* Salary */}
        <div>
          <h3 className="text-lg font-semibold mb-1">Salary</h3>
          <p className="text-muted-foreground">{salary}</p>
        </div>
        
        {/* Posted Date */}
        <div>
          <h3 className="text-lg font-semibold mb-1">Posted On</h3>
          <p className="text-muted-foreground">{formatDate(postedDate)}</p>
        </div>
        
        {/* Application Deadline */}
        <div>
          <h3 className="text-lg font-semibold mb-1">Application Deadline</h3>
          <p className={`${daysRemaining < 7 ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
            {formatDate(applicationDeadline)}
            <br />
            {daysRemaining <= 0 
              ? 'Deadline passed' 
              : `${daysRemaining} days remaining`}
          </p>
        </div>
        
        {/* Apply Button */}
        <Button className="w-full mt-4" size="lg" onClick={onApply}>
          Apply Now
        </Button>
        
        {/* Save Button */}
        <Button 
          variant="outline" 
          className="w-full gap-2" 
          onClick={onSaveVacancy}
        >
          <Heart className={`h-4 w-4 ${isSaved ? 'fill-primary text-primary' : ''}`} />
          {isSaved ? 'Saved' : 'Save for Later'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default VacancySidebar;
