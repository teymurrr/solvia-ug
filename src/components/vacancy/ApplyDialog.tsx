import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useVacancyApplication } from '@/hooks/useVacancyApplication';
import { useLanguage } from '@/hooks/useLanguage';
import { Loader2, CheckCircle2, Upload, FileText, X } from 'lucide-react';
import Analytics from '@/utils/analyticsTracking';

interface ApplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vacancyId: string;
  vacancyTitle: string;
  onSuccess?: () => void;
}

const ACCEPTED_FILE_TYPES = '.pdf,.doc,.docx';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ApplyDialog: React.FC<ApplyDialogProps> = ({
  open,
  onOpenChange,
  vacancyId,
  vacancyTitle,
  onSuccess,
}) => {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { submitApplication, isSubmitting } = useVacancyApplication();
  const { t } = useLanguage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      alert('File too large (max 5 MB)');
      return;
    }
    setCvFile(file);
  };

  const handleSubmit = async () => {
    const success = await submitApplication(vacancyId, message || undefined, cvFile || undefined);
    if (success) {
      Analytics.vacancyApplied(vacancyId);
      setSubmitted(true);
      onSuccess?.();
      setTimeout(() => {
        onOpenChange(false);
        setSubmitted(false);
        setMessage('');
        setCvFile(null);
      }, 2000);
    }
  };

  const handleClose = (open: boolean) => {
    if (!isSubmitting) {
      onOpenChange(open);
      if (!open) {
        setSubmitted(false);
        setMessage('');
        setCvFile(null);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <div className="flex flex-col items-center py-6 text-center gap-3">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <DialogTitle>
              {t?.vacancies?.applyDialog?.successTitle || "Interest submitted!"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {t?.vacancies?.applyDialog?.successDesc ||
                "We've received your interest! Our team will match you with this opportunity as part of your homologation journey."}
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                {t?.vacancies?.applyDialog?.title || "Express Interest"}
              </DialogTitle>
              <DialogDescription>
                {(t?.vacancies?.applyDialog?.subtitle || "Let us know you're interested in:") + " "}
                <span className="font-medium text-foreground">{vacancyTitle}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="py-2 space-y-4">
              <Textarea
                placeholder={
                  t?.vacancies?.applyDialog?.placeholder ||
                  "Optional: Add a message about why you're interested in this position..."
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                disabled={isSubmitting}
              />

              {/* CV Upload */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_FILE_TYPES}
                  onChange={handleFileChange}
                  className="hidden"
                />
                {cvFile ? (
                  <div className="flex items-center gap-2 p-3 rounded-md border bg-muted/50">
                    <FileText className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm truncate flex-1">{cvFile.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      onClick={() => setCvFile(null)}
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start gap-2 text-muted-foreground"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting}
                  >
                    <Upload className="h-4 w-4" />
                    <span>{t?.vacancies?.applyDialog?.uploadCV || 'Upload CV (Optional)'}</span>
                    <span className="ml-auto text-xs opacity-60">
                      {t?.vacancies?.applyDialog?.uploadCVDesc || 'PDF, DOC or DOCX – max 5 MB'}
                    </span>
                  </Button>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleClose(false)} disabled={isSubmitting}>
                {t?.common?.cancel || "Cancel"}
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t?.common?.loading || "Loading..."}
                  </>
                ) : (
                  t?.vacancies?.applyDialog?.submit || "Submit Interest"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplyDialog;
