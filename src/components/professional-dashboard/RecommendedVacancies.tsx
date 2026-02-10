import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { Vacancy } from '@/hooks/useVacancies';
import VacancyCard from '@/components/VacancyCard';
import { ProfileFormValues } from '@/components/professional-profile/types';
import { useLanguage } from '@/hooks/useLanguage';

interface RecommendedVacanciesProps {
  vacancies: Vacancy[];
  profileData: ProfileFormValues | null;
  savedVacancies: string[];
  appliedVacancies: string[];
  onSaveToggle: (id: string) => void;
}

const RecommendedVacancies: React.FC<RecommendedVacanciesProps> = ({
  vacancies,
  profileData,
  savedVacancies,
  appliedVacancies,
  onSaveToggle,
}) => {
  const { t } = useLanguage();

  const recommended = useMemo(() => {
    if (!profileData) return [];

    const targetCountry = profileData.targetCountry?.toLowerCase() || '';
    const specialty = profileData.specialty?.toLowerCase() || '';
    const profession = profileData.profession?.toLowerCase() || '';

    // Score each vacancy by relevance
    const scored = vacancies.map(v => {
      let score = 0;
      const country = (v.country || v.location || '').toLowerCase();
      const vSpecialty = (v.specialty || '').toLowerCase();
      const vDept = (v.department || '').toLowerCase();
      const vTitle = (v.title || '').toLowerCase();

      if (targetCountry && country.includes(targetCountry)) score += 3;
      if (specialty && (vSpecialty.includes(specialty) || vDept.includes(specialty) || vTitle.includes(specialty))) score += 2;
      if (profession && vTitle.includes(profession)) score += 1;

      return { vacancy: v, score };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(s => s.vacancy);
  }, [vacancies, profileData]);

  if (recommended.length === 0) return null;

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">
            {t?.dashboard?.recommended?.title || 'Recommended for You'}
          </CardTitle>
        </div>
        <CardDescription>
          {t?.dashboard?.recommended?.description || 'Vacancies matching your profile and preferences'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {recommended.map((vacancy) => (
            <div key={vacancy.id} className="relative">
              <Badge 
                className="absolute -top-2 right-4 z-10 bg-primary text-primary-foreground"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                {t?.dashboard?.recommended?.badge || 'Recommended'}
              </Badge>
              <VacancyCard
                {...vacancy}
                jobType={vacancy.job_type}
                showSaveOption={true}
                isSaved={savedVacancies.includes(vacancy.id)}
                onSaveToggle={onSaveToggle}
                isDashboardCard={true}
                isApplied={appliedVacancies.includes(vacancy.id)}
                fromDashboard={true}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedVacancies;
