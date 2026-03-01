import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lock, 
  Clock, 
  FileText, 
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { homologationDataByCountry } from '@/data/homologationData';
import { useLanguage } from '@/hooks/useLanguage';
import { ProfileFormValues } from '@/components/professional-profile/types';

interface HomologationPreviewProps {
  profileData: ProfileFormValues | null;
}

const HomologationPreview: React.FC<HomologationPreviewProps> = ({ profileData }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const targetCountry = profileData?.targetCountry || 'germany';
  const doctorType = profileData?.doctorType || 'general';
  const countryData = homologationDataByCountry[targetCountry];

  const salaryData = useMemo(() => {
    if (!countryData) return null;
    const salary = countryData.averageSalaries[doctorType as keyof typeof countryData.averageSalaries] 
      || countryData.averageSalaries.general;
    const currency = countryData.averageSalaries.currency;
    return { monthlySalary: salary, currency };
  }, [countryData, doctorType]);

  // Fallback when no valid country data: show a prompt to set target country
  if (!countryData) {
    return (
      <Card className="border-amber-200/50 dark:border-amber-800/30 bg-gradient-to-br from-amber-50/50 via-background to-orange-50/30 dark:from-amber-950/10 dark:to-orange-950/10">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            🌍 {t?.dashboard?.homologationPreview?.title || 'Your Homologation Roadmap'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                {(t as any)?.dashboard?.homologationPreview?.noCountryTitle || 'Set your target country'}
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                {(t as any)?.dashboard?.homologationPreview?.noCountryDesc || 'Take our free assessment to see your personalized homologation roadmap, timeline, and costs.'}
              </p>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/homologation-wizard')}
            className="w-full gap-2"
          >
            {(t as any)?.dashboard?.homologationPreview?.takeAssessment || 'Take Free Assessment'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  const COUNTRY_FLAGS: Record<string, string> = {
    germany: '🇩🇪', austria: '🇦🇹', spain: '🇪🇸', italy: '🇮🇹', france: '🇫🇷',
  };

  // Show first 3 documents free, rest locked
  const freeDocCount = 3;
  const documents = countryData.documents;

  return (
    <Card className="border-amber-200/50 dark:border-amber-800/30 bg-gradient-to-br from-amber-50/50 via-background to-orange-50/30 dark:from-amber-950/10 dark:to-orange-950/10">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              {COUNTRY_FLAGS[targetCountry] || '🌍'}
              {t?.dashboard?.homologationPreview?.title || 'Your Homologation Roadmap'}
            </CardTitle>
            <CardDescription>
              {t?.dashboard?.homologationPreview?.subtitle || `Estimated process for ${countryData.country}`}
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-amber-300 text-amber-700 dark:text-amber-300">
            {t?.dashboard?.homologationPreview?.free || 'Free Preview'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Salary Loss Counter */}
        {salaryData && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-red-800 dark:text-red-300 text-sm">
                  {t?.dashboard?.homologationPreview?.salaryLossTitle || 'Opportunity Cost'}
                </h4>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300 mt-1">
                  ~{salaryData.monthlySalary.toLocaleString()} {salaryData.currency}
                  <span className="text-sm font-normal text-red-600 dark:text-red-400">
                    {' '}/{t?.dashboard?.homologationPreview?.perMonth || 'month'}
                  </span>
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {t?.dashboard?.homologationPreview?.salaryLossDesc || 
                    'Every month without your recognized diploma is a month of lost potential earnings.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Overview */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Clock className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="text-lg font-bold">{countryData.processTime.min} {t?.homologationResult?.diagnosis?.monthsUnit || 'months'}</p>
            <p className="text-xs text-muted-foreground">
              {t?.dashboard?.homologationPreview?.fastest || 'Fastest'}
            </p>
          </div>
          <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
            <Clock className="w-5 h-5 mx-auto text-primary mb-1" />
            <p className="text-lg font-bold text-primary">{countryData.processTime.med} {t?.homologationResult?.diagnosis?.monthsUnit || 'months'}</p>
            <p className="text-xs text-muted-foreground">
              {t?.dashboard?.homologationPreview?.average || 'Average'}
            </p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <Clock className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
            <p className="text-lg font-bold text-muted-foreground">{countryData.processTime.max} {t?.homologationResult?.diagnosis?.monthsUnit || 'months'}</p>
            <p className="text-xs text-muted-foreground">
              {t?.dashboard?.homologationPreview?.longest || 'Longest'}
            </p>
          </div>
        </div>

        {/* Document Requirements (partial) */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {t?.dashboard?.homologationPreview?.requiredDocs || 'Required Documents'}
            <span className="text-muted-foreground font-normal">({documents.length})</span>
          </h4>
          <div className="space-y-2">
            {documents.slice(0, freeDocCount).map((doc, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.description}</p>
                </div>
              </div>
            ))}
            {documents.length > freeDocCount && (
              <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg border border-dashed border-muted-foreground/20">
                <Lock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    +{documents.length - freeDocCount} {t?.dashboard?.homologationPreview?.moreDocuments || 'more documents'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t?.dashboard?.homologationPreview?.unlockAccess || 'Unlock full access with a plan'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Social Proof */}
        <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200/50 dark:border-green-800/30">
          <p className="text-sm italic text-green-800 dark:text-green-300">
            "{t?.dashboard?.homologationPreview?.testimonial || 
              'I completed my homologation in 6 months with Solvia\'s Complete Package. The step-by-step guidance saved me months of research.'}"
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">
            — {t?.dashboard?.homologationPreview?.testimonialAuthor || 'Maria, Doctor from Colombia'}
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => navigate('/homologation-wizard')}
            className="flex-1 gap-2"
            size="lg"
          >
            <FileText className="w-4 h-4" />
            {t?.dashboard?.homologationPreview?.ctaUnlock || 'Unlock Your Full Roadmap'}
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/homologation-payment')}
            className="gap-2"
          >
            {t?.dashboard?.homologationPreview?.viewPlans || 'View Plans'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HomologationPreview;
