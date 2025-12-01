import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Check, 
  AlertCircle, 
  Clock, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  HelpCircle,
  X,
  Loader2,
  Eye,
  GraduationCap,
  BookOpen,
  Stamp,
  Languages,
  IdCard
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/hooks/useLanguage';
import { DocumentRequirement, ClientDocument } from '@/hooks/useDocuments';
import { cn } from '@/lib/utils';

interface DocumentUploadCardProps {
  requirement: DocumentRequirement;
  document?: ClientDocument;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => void;
  onPreview?: () => void;
  isUploading: boolean;
  isValidating?: boolean;
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

export const DocumentUploadCard: React.FC<DocumentUploadCardProps> = ({
  requirement,
  document,
  onUpload,
  onDelete,
  onPreview,
  isUploading,
  isValidating,
  language,
}) => {
  const { t } = useLanguage();
  const [showHelp, setShowHelp] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const docs = t.documents as any;

  // Get localized content
  const getName = () => {
    const key = `document_name_${language}` as keyof DocumentRequirement;
    return (requirement[key] as string) || requirement.document_name_en;
  };

  const getDescription = () => {
    const key = `description_${language}` as keyof DocumentRequirement;
    return (requirement[key] as string) || requirement.description_en;
  };

  const getInstructions = () => {
    const key = `instructions_${language}` as keyof DocumentRequirement;
    return (requirement[key] as string) || requirement.instructions_en;
  };

  const getHowToObtain = () => {
    const key = `how_to_obtain_${language}` as keyof DocumentRequirement;
    return (requirement[key] as string) || requirement.how_to_obtain_en;
  };

  const getFeedback = () => {
    if (!document) return null;
    const key = `ai_feedback_${language}` as keyof typeof document;
    return (document[key] as string) || document.ai_feedback_en;
  };

  const status = document?.status || 'not_submitted';
  const hasFile = !!document?.file_path;

  const getStatusColor = () => {
    switch (status) {
      case 'complete': return 'bg-green-500';
      case 'partial': return 'bg-orange-500';
      case 'invalid': return 'bg-red-500';
      case 'pending_review': return 'bg-blue-500';
      default: return 'bg-muted';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'complete': return <Check className="h-4 w-4 text-white" />;
      case 'partial': return <AlertCircle className="h-4 w-4 text-white" />;
      case 'invalid': return <X className="h-4 w-4 text-white" />;
      case 'pending_review': return <Clock className="h-4 w-4 text-white" />;
      default: return null;
    }
  };

  const IconComponent = iconMap[requirement.icon || ''] || FileText;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      await onUpload(file);
    }
  }, [onUpload]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUpload(file);
    }
    e.target.value = '';
  }, [onUpload]);

  return (
    <Card className={cn(
      "transition-all duration-300 overflow-hidden",
      isDragging && "ring-2 ring-primary",
      status === 'complete' && "border-green-500/50",
      status === 'partial' && "border-orange-500/50",
      status === 'invalid' && "border-red-500/50"
    )}>
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-4 flex items-start gap-4">
          {/* Icon with status indicator */}
          <div className="relative">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              hasFile ? "bg-primary/10" : "bg-muted"
            )}>
              <IconComponent className={cn(
                "h-6 w-6",
                hasFile ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            {hasFile && (
              <div className={cn(
                "absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center",
                getStatusColor()
              )}>
                {getStatusIcon()}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate">{getName()}</h3>
              <Badge variant={requirement.is_required ? "default" : "secondary"} className="shrink-0">
                {requirement.is_required ? docs?.card?.required : docs?.card?.optional}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{getDescription()}</p>
          </div>

          {/* Help toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowHelp(!showHelp)}
            className="shrink-0"
          >
            {showHelp ? <ChevronUp className="h-4 w-4" /> : <HelpCircle className="h-4 w-4" />}
          </Button>
        </div>

        {/* Help panel */}
        <AnimatePresence>
          {showHelp && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-3 bg-muted/30">
                {getInstructions() && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-1">{docs?.card?.instructions}</h4>
                    <p className="text-sm text-muted-foreground">{getInstructions()}</p>
                  </div>
                )}
                {getHowToObtain() && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-1">{docs?.card?.howToObtain}</h4>
                    <p className="text-sm text-muted-foreground">{getHowToObtain()}</p>
                  </div>
                )}
                <div className="flex gap-4 text-sm">
                  {requirement.estimated_time && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{docs?.card?.estimatedTime}: {requirement.estimated_time}</span>
                    </div>
                  )}
                  {requirement.estimated_cost && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <span>{docs?.card?.estimatedCost}: {requirement.estimated_cost}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload area */}
        <div className="p-4 pt-0">
          {!hasFile ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
              )}
            >
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">{docs?.card?.uploading || 'Uploading...'}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">{docs?.card?.dragAndDrop}</p>
                  <p className="text-xs text-muted-foreground">{docs?.card?.supportedFormats} • {docs?.card?.maxSize}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {/* File info */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <FileText className="h-5 w-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{document?.file_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {document?.file_size ? `${(document.file_size / 1024 / 1024).toFixed(2)} MB` : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={onPreview}
                    title={docs?.card?.preview || 'Preview'}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onDelete}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Validation in progress indicator */}
              {isValidating && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                  <span className="text-sm text-blue-600 dark:text-blue-400">
                    {docs?.card?.analyzing || 'AI is analyzing your document...'}
                  </span>
                </div>
              )}

              {/* Status badge with feedback */}
              {status !== 'not_submitted' && !isValidating && (
                <div className="space-y-2">
                  <Badge variant="outline" className={cn(
                    "w-full justify-center py-1",
                    status === 'complete' && "border-green-500 text-green-600 bg-green-50 dark:bg-green-950/30",
                    status === 'partial' && "border-orange-500 text-orange-600 bg-orange-50 dark:bg-orange-950/30",
                    status === 'invalid' && "border-red-500 text-red-600 bg-red-50 dark:bg-red-950/30",
                    status === 'pending_review' && "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950/30"
                  )}>
                    {status === 'complete' && <Check className="h-3 w-3 mr-1" />}
                    {status === 'partial' && <AlertCircle className="h-3 w-3 mr-1" />}
                    {status === 'invalid' && <X className="h-3 w-3 mr-1" />}
                    {status === 'pending_review' && <Clock className="h-3 w-3 mr-1" />}
                    {docs?.statusLabels?.[status]}
                  </Badge>
                  
                  {/* Show AI feedback if available */}
                  {document && getFeedback() && (
                    <p className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
                      {getFeedback()}
                    </p>
                  )}
                </div>
              )}

              {/* Re-upload option */}
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                <Button variant="outline" className="w-full" disabled={isUploading}>
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  {docs?.card?.uploadAnother}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* "I don't have this" button */}
        {!hasFile && !showHelp && (
          <div className="px-4 pb-4">
            <Button
              variant="link"
              className="w-full text-muted-foreground"
              onClick={() => setShowHelp(true)}
            >
              {docs?.card?.dontHaveIt}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
