import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useDocuments } from '@/hooks/useDocuments';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Clock, FileText, ArrowRight } from 'lucide-react';

interface HomologationProgressCompactProps {
  country: string;
}

const HomologationProgressCompact: React.FC<HomologationProgressCompactProps> = ({ country }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { clientDocuments, requirements, getProgressStats } = useDocuments(country);

  const stats = getProgressStats();

  const statusCounts = {
    complete: clientDocuments.filter(d => d.status === 'complete').length,
    issues: clientDocuments.filter(d => d.status === 'partial' || d.status === 'invalid').length,
    pending: clientDocuments.filter(d => d.status === 'pending_review').length,
    notSubmitted: requirements.length - clientDocuments.length,
  };

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {t?.documents?.progress?.complete || 'Progress'}
          </span>
          <span className="font-semibold">{stats.percentage}%</span>
        </div>
        <Progress value={stats.percentage} className="h-2" />
      </div>

      {/* Compact status grid */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/20">
          <CheckCircle2 className="w-3.5 h-3.5 mx-auto text-green-600 dark:text-green-400 mb-0.5" />
          <p className="text-sm font-semibold text-green-700 dark:text-green-300">{statusCounts.complete}</p>
          <p className="text-[10px] text-green-600 dark:text-green-400">{t?.documents?.status?.complete || 'Done'}</p>
        </div>
        <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20">
          <AlertCircle className="w-3.5 h-3.5 mx-auto text-amber-600 dark:text-amber-400 mb-0.5" />
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">{statusCounts.issues}</p>
          <p className="text-[10px] text-amber-600 dark:text-amber-400">{t?.documents?.status?.needsAttention || 'Issues'}</p>
        </div>
        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
          <Clock className="w-3.5 h-3.5 mx-auto text-blue-600 dark:text-blue-400 mb-0.5" />
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">{statusCounts.pending}</p>
          <p className="text-[10px] text-blue-600 dark:text-blue-400">{t?.documents?.status?.pendingReview || 'Review'}</p>
        </div>
        <div className="p-2 rounded-lg bg-muted">
          <FileText className="w-3.5 h-3.5 mx-auto text-muted-foreground mb-0.5" />
          <p className="text-sm font-semibold">{statusCounts.notSubmitted}</p>
          <p className="text-[10px] text-muted-foreground">{t?.documents?.status?.notSubmitted || 'To do'}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={() => navigate('/documents')}
          className="flex-1 gap-2"
          size="sm"
        >
          <FileText className="w-4 h-4" />
          {stats.percentage < 100
            ? (t?.dashboard?.homologation?.continueUpload || 'Continue Uploading')
            : (t?.dashboard?.homologation?.viewStatus || 'View Status')}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default HomologationProgressCompact;
