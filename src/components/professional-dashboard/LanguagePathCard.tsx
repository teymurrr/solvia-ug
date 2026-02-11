import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ArrowRight, Target } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { ProfileFormValues } from '@/components/professional-profile/types';
import { homologationDataByCountry } from '@/data/homologationData';

interface LanguagePathCardProps {
  profileData: ProfileFormValues | null;
  compact?: boolean;
}

const LANGUAGE_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const COUNTRY_LANGUAGE_MAP: Record<string, string> = {
  germany: 'German',
  austria: 'German',
  france: 'French',
  spain: 'Spanish',
  italy: 'Italian',
};

const LanguagePathCard: React.FC<LanguagePathCardProps> = ({ profileData, compact = false }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const targetCountry = profileData?.targetCountry || 'germany';
  const countryData = homologationDataByCountry[targetCountry];
  const requiredLevel = countryData?.languageRequirement?.level?.split('-')[0] || 'B2';
  const targetLanguageName = COUNTRY_LANGUAGE_MAP[targetCountry] || 'German';

  // Use the profile's languageLevel field directly (set via dropdown, no free-text matching needed)
  const currentLevel = profileData?.languageLevel?.toUpperCase() || '';
  const currentIndex = LANGUAGE_LEVELS.indexOf(currentLevel);
  const requiredIndex = LANGUAGE_LEVELS.indexOf(requiredLevel);

  const lp = (t as any)?.dashboard?.languagePath;

  const content = (
    <>
      {/* Level Progress */}
      <div className="flex items-center gap-1">
        {LANGUAGE_LEVELS.slice(0, requiredIndex + 1).map((level, i) => {
          const isCompleted = i <= currentIndex && currentIndex >= 0;
          const isCurrent = i === currentIndex;
          const isRequired = i === requiredIndex;

          return (
            <div key={level} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full h-2 rounded-full transition-colors ${
                  isCompleted
                    ? 'bg-primary'
                    : i <= requiredIndex
                      ? 'bg-muted'
                      : 'bg-muted/50'
                }`}
              />
              <span
                className={`text-[10px] font-medium ${
                  isCurrent
                    ? 'text-primary font-bold'
                    : isRequired
                      ? 'text-foreground font-semibold'
                      : 'text-muted-foreground'
                }`}
              >
                {level}
              </span>
            </div>
          );
        })}
      </div>

      {/* Status Text */}
      <div className="text-sm text-muted-foreground">
        {currentLevel ? (
          <p>
            <span className="font-medium text-foreground">{currentLevel}</span>
            {' → '}
            <span className="font-medium text-primary">{requiredLevel}</span>
            {' '}{lp?.required || 'required'}
          </p>
        ) : (
          <div className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200/50 dark:border-amber-800/30">
            <Target className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              {lp?.setLevel || 'Add your language level in your profile to track progress'}
            </p>
          </div>
        )}
      </div>

      {/* CTA */}
      <Button
        onClick={() => navigate(`/learning/starter-kit?country=${targetCountry}`)}
        variant="outline"
        size="sm"
        className="w-full gap-2 border-primary/30 hover:bg-primary/5"
      >
        {lp?.cta || 'Get Starter Kit (from €29)'}
        <ArrowRight className="w-3 h-3" />
      </Button>
    </>
  );

  if (compact) {
    return <div className="space-y-4">{content}</div>;
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-blue-50/30 dark:from-primary/5 dark:to-blue-950/10">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            {lp?.title || 'Your Language Path'}
          </CardTitle>
          <Badge variant="outline" className="text-xs border-primary/30 text-primary">
            {targetLanguageName}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {content}
      </CardContent>
    </Card>
  );
};

export default LanguagePathCard;
