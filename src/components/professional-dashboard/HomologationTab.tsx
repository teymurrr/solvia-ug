import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { usePaymentAccess } from '@/hooks/usePaymentAccess';
import { useDocuments } from '@/hooks/useDocuments';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  CreditCard,
  Globe,
  Sparkles
} from 'lucide-react';

const COUNTRY_FLAGS: Record<string, string> = {
  germany: '🇩🇪',
  austria: '🇦🇹',
  spain: '🇪🇸',
  italy: '🇮🇹',
  france: '🇫🇷',
};

const COUNTRY_NAMES: Record<string, Record<string, string>> = {
  germany: { en: 'Germany', es: 'Alemania', de: 'Deutschland', fr: 'Allemagne', ru: 'Германия' },
  austria: { en: 'Austria', es: 'Austria', de: 'Österreich', fr: 'Autriche', ru: 'Австрия' },
  spain: { en: 'Spain', es: 'España', de: 'Spanien', fr: 'Espagne', ru: 'Испания' },
  italy: { en: 'Italy', es: 'Italia', de: 'Italien', fr: 'Italie', ru: 'Италия' },
  france: { en: 'France', es: 'Francia', de: 'Frankreich', fr: 'France', ru: 'Франция' },
};

interface HomologationProgressCardProps {
  country: string;
  productType: string;
}

const HomologationProgressCard: React.FC<HomologationProgressCardProps> = ({ country, productType }) => {
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const { clientDocuments, requirements, getProgressStats } = useDocuments(country);
  
  const stats = getProgressStats();
  const countryName = COUNTRY_NAMES[country]?.[currentLanguage] || country;
  const flag = COUNTRY_FLAGS[country] || '🌍';

  // Get document status breakdown
  const statusCounts = {
    complete: clientDocuments.filter(d => d.status === 'complete').length,
    partial: clientDocuments.filter(d => d.status === 'partial').length,
    invalid: clientDocuments.filter(d => d.status === 'invalid').length,
    pending: clientDocuments.filter(d => d.status === 'pending_review').length,
    notSubmitted: requirements.length - clientDocuments.length,
  };

  const getPackageLabel = (type: string) => {
    switch (type) {
      case 'homologation': return t?.payments?.packages?.homologation?.title || 'Homologation';
      case 'language_prep': return t?.dashboard?.homologation?.languagePackage || 'Homologation & Language';
      case 'premium_support': return t?.dashboard?.homologation?.premiumPackage || 'Premium';
      default: return type;
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{flag}</div>
            <div>
              <CardTitle className="text-xl">{countryName}</CardTitle>
              <Badge variant="secondary" className="mt-1">
                {getPackageLabel(productType)}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{stats.percentage}%</div>
            <p className="text-xs text-muted-foreground">
              {t?.documents?.progress?.complete || 'Complete'}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <Progress value={stats.percentage} className="h-2" />
        
        {/* Status Summary */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/20">
            <CheckCircle2 className="w-4 h-4 mx-auto text-green-600 dark:text-green-400 mb-1" />
            <p className="text-lg font-semibold text-green-700 dark:text-green-300">{statusCounts.complete}</p>
            <p className="text-xs text-green-600 dark:text-green-400">{t?.documents?.status?.complete || 'Complete'}</p>
          </div>
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20">
            <AlertCircle className="w-4 h-4 mx-auto text-amber-600 dark:text-amber-400 mb-1" />
            <p className="text-lg font-semibold text-amber-700 dark:text-amber-300">{statusCounts.partial + statusCounts.invalid}</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">{t?.documents?.status?.needsAttention || 'Issues'}</p>
          </div>
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <Clock className="w-4 h-4 mx-auto text-blue-600 dark:text-blue-400 mb-1" />
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">{statusCounts.pending}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">{t?.documents?.status?.pendingReview || 'Pending'}</p>
          </div>
          <div className="p-2 rounded-lg bg-muted">
            <FileText className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
            <p className="text-lg font-semibold">{statusCounts.notSubmitted}</p>
            <p className="text-xs text-muted-foreground">{t?.documents?.status?.notSubmitted || 'Pending'}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={() => navigate('/documents-upload')}
            className="flex-1 gap-2"
            variant={stats.percentage < 100 ? 'default' : 'outline'}
          >
            <FileText className="w-4 h-4" />
            {stats.percentage < 100 
              ? (t?.documents?.actions?.continueUpload || 'Continue Upload')
              : (t?.documents?.actions?.viewDocuments || 'View Documents')
            }
          </Button>
          <Button 
            onClick={() => navigate('/documents-status')}
            variant="outline"
            className="gap-2"
          >
            {t?.documents?.actions?.viewStatus || 'Status'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const HomologationTab: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isLoading, paidCountries } = usePaymentAccess();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // User has no paid countries - show CTA
  if (paidCountries.length === 0) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Globe className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {t?.dashboard?.homologation?.title || 'Get Your Diploma Recognized'}
          </CardTitle>
          <CardDescription className="text-base max-w-md mx-auto">
            {t?.dashboard?.homologation?.description || 
              'Start your homologation process to practice medicine in Germany'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6 pb-8">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm">
              {t?.dashboard?.homologation?.benefits || 
                'Official recognition of your medical diploma for practice in Germany'}
            </span>
          </div>
          <Button 
            onClick={() => navigate('/homologation-wizard')}
            size="lg"
            className="gap-2"
          >
            <CreditCard className="w-5 h-5" />
            {t?.dashboard?.homologation?.ctaButton || 'Start Homologation Process'}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  // User has paid countries - show progress cards
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {t?.dashboard?.homologation?.yourProcesses || 'Your Homologation Processes'}
          </h2>
          <p className="text-muted-foreground">
            {t?.dashboard?.homologation?.trackProgress || 'Track your document uploads and verification status'}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/homologation-wizard')}
          className="gap-2"
        >
          <Globe className="w-4 h-4" />
          {t?.dashboard?.homologation?.addCountry || 'Add Another Country'}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {paidCountries.map((payment) => (
          <HomologationProgressCard
            key={payment.target_country}
            country={payment.target_country}
            productType={payment.product_type}
          />
        ))}
      </div>
    </div>
  );
};

export default HomologationTab;
