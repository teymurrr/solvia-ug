import React from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle, X, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

interface ProgressOverviewProps {
  stats: {
    total: number;
    complete: number;
    partial: number;
    invalid: number;
    notSubmitted: number;
    pendingReview: number;
    uploaded: number;
    percentage: number;
  };
}

export const ProgressOverview: React.FC<ProgressOverviewProps> = ({ stats }) => {
  const { t } = useLanguage();
  const docs = t.documents as any;

  const allComplete = stats.complete === stats.total && stats.total > 0;

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{docs?.status?.overallProgress}</span>
          <span className="font-semibold text-foreground">{stats.percentage}%</span>
        </div>
        <Progress value={stats.percentage} className="h-3" />
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Complete */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "p-4 rounded-xl text-center",
            "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
          )}
        >
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="h-5 w-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.complete}</p>
          <p className="text-xs text-green-600/70 dark:text-green-400/70">{docs?.status?.complete}</p>
        </motion.div>

        {/* Partial */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "p-4 rounded-xl text-center",
            "bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800"
          )}
        >
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-orange-500 flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.partial}</p>
          <p className="text-xs text-orange-600/70 dark:text-orange-400/70">{docs?.status?.partial}</p>
        </motion.div>

        {/* Invalid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "p-4 rounded-xl text-center",
            "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
          )}
        >
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-red-500 flex items-center justify-center">
            <X className="h-5 w-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.invalid}</p>
          <p className="text-xs text-red-600/70 dark:text-red-400/70">{docs?.status?.invalid}</p>
        </motion.div>

        {/* Not Submitted */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className={cn(
            "p-4 rounded-xl text-center",
            "bg-muted/50 border border-muted"
          )}
        >
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
            <Clock className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold text-muted-foreground">{stats.notSubmitted}</p>
          <p className="text-xs text-muted-foreground">{docs?.status?.notSubmitted}</p>
        </motion.div>
      </div>

      {/* All complete message */}
      {allComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">
            {docs?.status?.allComplete}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {docs?.status?.allCompleteMessage}
          </p>
        </motion.div>
      )}
    </div>
  );
};
