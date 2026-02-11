import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FileCheck, Briefcase, ArrowRight, Globe, Users } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { ProfileFormValues } from '@/components/professional-profile/types';
import LanguagePathCard from './LanguagePathCard';
import HomologationPreview from './HomologationPreview';

interface MyJourneyTabProps {
  profileData: ProfileFormValues | null;
}

const COUNTRY_NAMES: Record<string, Record<string, string>> = {
  germany: { en: 'Germany', es: 'Alemania', de: 'Deutschland', fr: 'Allemagne', ru: 'Германия' },
  austria: { en: 'Austria', es: 'Austria', de: 'Österreich', fr: 'Autriche', ru: 'Австрия' },
  spain: { en: 'Spain', es: 'España', de: 'Spanien', fr: 'Espagne', ru: 'Испания' },
  italy: { en: 'Italy', es: 'Italia', de: 'Italien', fr: 'Italie', ru: 'Италия' },
  france: { en: 'France', es: 'Francia', de: 'Frankreich', fr: 'France', ru: 'Франция' },
};

const COUNTRY_FLAGS: Record<string, string> = {
  germany: '🇩🇪', austria: '🇦🇹', spain: '🇪🇸', italy: '🇮🇹', france: '🇫🇷',
};

const MyJourneyTab: React.FC<MyJourneyTabProps> = ({ profileData }) => {
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();

  const targetCountry = profileData?.targetCountry;
  const countryName = targetCountry
    ? COUNTRY_NAMES[targetCountry]?.[currentLanguage] || targetCountry
    : null;
  const flag = targetCountry ? COUNTRY_FLAGS[targetCountry] || '🌍' : '🌍';

  const mj = (t as any)?.dashboard?.myJourney;

  return (
    <div className="space-y-6">
      {/* Journey Header */}
      <div className="flex items-center gap-3">
        <div className="text-3xl">{flag}</div>
        <div>
          <h2 className="text-xl font-semibold">
            {mj?.title || 'My Journey'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {countryName
              ? `${mj?.subtitleWithCountry || 'Your path to practicing medicine in'} ${countryName}`
              : mj?.subtitle || 'Your path to practicing medicine abroad'
            }
          </p>
        </div>
      </div>

      {/* Step 1: Language — inline progress, no card-in-card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">1</div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {mj?.stepLanguage || 'Learn the Language'}
              </CardTitle>
              <CardDescription>
                {mj?.stepLanguageDesc || 'Pass the required language exam for your target country'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <LanguagePathCard profileData={profileData} compact />
        </CardContent>
      </Card>

      {/* Step 2: Homologation — lightweight preview teaser */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">2</div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileCheck className="w-4 h-4" />
                {mj?.stepHomologation || 'Get Your Diploma Recognized'}
              </CardTitle>
              <CardDescription>
                {mj?.stepHomologationDesc || 'Complete the document and verification process'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <HomologationPreview profileData={profileData} />
        </CardContent>
      </Card>

      {/* Step 3: Find Work */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">3</div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {mj?.stepWork || 'Find Your Position'}
              </CardTitle>
              <CardDescription>
                {mj?.stepWorkDesc || 'Browse vacancies matching your qualifications'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => navigate('/professionals')} variant="outline" className="gap-2">
              <Briefcase className="w-4 h-4" />
              {mj?.browseVacancies || 'Browse Vacancies'}
              <ArrowRight className="w-4 h-4" />
            </Button>
            {!targetCountry && (
              <Button onClick={() => navigate('/homologation-wizard')} variant="outline" className="gap-2">
                <Globe className="w-4 h-4" />
                {mj?.setCountry || 'Set Your Target Country'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Community Link */}
      <div className="flex items-center justify-center py-2">
        <Link
          to="/community"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Users className="w-4 h-4" />
          {(t as any)?.community?.title || 'Join the Community'}
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

export default MyJourneyTab;
