import React from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  AlertCircle, 
  X, 
  Clock, 
  FileText,
  Upload,
  GraduationCap,
  BookOpen,
  Stamp,
  Languages,
  IdCard
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { DocumentWithRequirement } from '@/hooks/useDocuments';
import { cn } from '@/lib/utils';

interface DocumentStatusCardProps {
  document: DocumentWithRequirement;
  onReupload: () => void;
  language: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'passport': IdCard,
  'graduation-cap': GraduationCap,
  'file-text': FileText,
  'book-open': BookOpen,
  'stamp': Stamp,
  'languages': Languages,
};

export const DocumentStatusCard: React.FC<DocumentStatusCardProps> = ({
  document,
  onReupload,
  language,
}) => {
  const { t } = useLanguage();
  const docs = t.documents as any;

  const getName = () => {
    const key = `document_name_${language}` as keyof typeof document.requirement;
    return (document.requirement[key] as string) || document.requirement.document_name_en;
  };

  const getFeedback = () => {
    const key = `ai_feedback_${language}` as keyof typeof document;
    return (document[key] as string) || document.ai_feedback_en;
  };

  const status = document.status;
  const hasFile = !!document.file_path;
  const IconComponent = iconMap[document.requirement.icon || ''] || FileText;

  const getStatusConfig = () => {
    switch (status) {
      case 'complete':
        return {
          bgColor: 'bg-green-500',
          lightBg: 'bg-green-50 dark:bg-green-950/30',
          textColor: 'text-green-600 dark:text-green-400',
          borderColor: 'border-green-500/30',
          icon: Check,
          label: docs?.status?.complete,
        };
      case 'partial':
        return {
          bgColor: 'bg-orange-500',
          lightBg: 'bg-orange-50 dark:bg-orange-950/30',
          textColor: 'text-orange-600 dark:text-orange-400',
          borderColor: 'border-orange-500/30',
          icon: AlertCircle,
          label: docs?.status?.partial,
        };
      case 'invalid':
        return {
          bgColor: 'bg-red-500',
          lightBg: 'bg-red-50 dark:bg-red-950/30',
          textColor: 'text-red-600 dark:text-red-400',
          borderColor: 'border-red-500/30',
          icon: X,
          label: docs?.status?.invalid,
        };
      case 'pending_review':
        return {
          bgColor: 'bg-blue-500',
          lightBg: 'bg-blue-50 dark:bg-blue-950/30',
          textColor: 'text-blue-600 dark:text-blue-400',
          borderColor: 'border-blue-500/30',
          icon: Clock,
          label: docs?.status?.pendingReview,
        };
      default:
        return {
          bgColor: 'bg-muted',
          lightBg: 'bg-muted/50',
          textColor: 'text-muted-foreground',
          borderColor: 'border-muted',
          icon: FileText,
          label: docs?.status?.notSubmitted,
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "transition-all duration-300",
        config.borderColor,
        hasFile && "border-l-4"
      )}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Traffic light indicator */}
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
              config.bgColor
            )}>
              <StatusIcon className="h-6 w-6 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <IconComponent className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">{getName()}</h3>
                <Badge variant={document.requirement.is_required ? "default" : "secondary"} className="shrink-0">
                  {document.requirement.is_required ? docs?.card?.required : docs?.card?.optional}
                </Badge>
              </div>

              {/* Status label */}
              <p className={cn("text-sm font-medium mb-2", config.textColor)}>
                {config.label}
              </p>

              {/* Feedback */}
              {getFeedback() && (
                <div className={cn("p-3 rounded-lg mb-3", config.lightBg)}>
                  <p className="text-sm text-foreground">{getFeedback()}</p>
                </div>
              )}

              {/* File info */}
              {hasFile && document.file_name && (
                <p className="text-xs text-muted-foreground mb-3">
                  {document.file_name}
                </p>
              )}

              {/* Actions */}
              {(status === 'partial' || status === 'invalid' || status === 'not_submitted') && (
                <Button
                  variant={status === 'not_submitted' ? 'default' : 'outline'}
                  size="sm"
                  onClick={onReupload}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {status === 'not_submitted' ? 'Upload' : docs?.status?.reupload}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
