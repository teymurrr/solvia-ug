import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Languages, Plus, Award, Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { Progress } from '@/components/ui/progress';

interface Language {
  language?: string;
  level?: string;
  certificate?: string;
}

interface LanguagesCardProps {
  languages: Language[];
  onEdit: () => void;
  loading?: boolean;
}

// Map CEFR levels to numeric values for progress display
const levelToPercentage: Record<string, number> = {
  'A1': 16,
  'A2': 33,
  'B1': 50,
  'B2': 66,
  'C1': 83,
  'C2': 100,
  'Native': 100,
};

const levelColors: Record<string, string> = {
  'A1': 'bg-red-100 text-red-700 border-red-200',
  'A2': 'bg-orange-100 text-orange-700 border-orange-200',
  'B1': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'B2': 'bg-blue-100 text-blue-700 border-blue-200',
  'C1': 'bg-green-100 text-green-700 border-green-200',
  'C2': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Native': 'bg-purple-100 text-purple-700 border-purple-200',
};

const LanguagesCard: React.FC<LanguagesCardProps> = ({ languages, onEdit, loading = false }) => {
  const { t } = useLanguage();
  
  const languagesText = t?.dashboard?.profile?.languagesCard || {
    title: 'Language Skills',
    description: 'Your language proficiency levels',
    noLanguages: 'No languages added yet',
    addLanguages: 'Add Languages',
    editLanguages: 'Edit Languages',
    certified: 'Certified',
    level: 'Level'
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-primary" />
            {languagesText.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            <div className="h-16 bg-muted rounded-lg" />
            <div className="h-16 bg-muted rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{languagesText.title}</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={onEdit}>
            {languages && languages.length > 0 ? (
              languagesText.editLanguages
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                {languagesText.addLanguages}
              </>
            )}
          </Button>
        </div>
        <CardDescription>{languagesText.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {languages && languages.filter(l => l.language).length > 0 ? (
          <div className="space-y-4">
            {languages.filter(l => l.language).map((lang, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <Globe className="h-8 w-8 text-primary/60" />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium truncate">{lang.language}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${levelColors[lang.level] || 'bg-muted'}`}
                    >
                      {lang.level}
                    </Badge>
                    {lang.certificate && (
                      <Badge variant="secondary" className="text-xs gap-1">
                        <Award className="h-3 w-3" />
                        {languagesText.certified}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={levelToPercentage[lang.level] || 0} 
                      className="h-2 flex-grow"
                    />
                    <span className="text-xs text-muted-foreground w-8">
                      {levelToPercentage[lang.level] || 0}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Languages className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground mb-4">{languagesText.noLanguages}</p>
            <Button onClick={onEdit} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              {languagesText.addLanguages}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LanguagesCard;
