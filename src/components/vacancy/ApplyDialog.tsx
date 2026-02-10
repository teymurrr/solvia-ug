import React, { useState } from 'react';
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
import { Loader2, CheckCircle2 } from 'lucide-react';

interface ApplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vacancyId: string;
  vacancyTitle: string;
  onSuccess?: () => void;
}

const ApplyDialog: React.FC<ApplyDialogProps> = ({
  open,
  onOpenChange,
  vacancyId,
  vacancyTitle,
  onSuccess,
}) => {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { submitApplication, isSubmitting } = useVacancyApplication();
  const { t } = useLanguage();

  const handleSubmit = async () => {
    const success = await submitApplication(vacancyId, message || undefined);
    if (success) {
      setSubmitted(true);
      onSuccess?.();
      setTimeout(() => {
        onOpenChange(false);
        setSubmitted(false);
        setMessage('');
      }, 2000);
    }
  };

  const handleClose = (open: boolean) => {
    if (!isSubmitting) {
      onOpenChange(open);
      if (!open) {
        setSubmitted(false);
        setMessage('');
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
            <div className="py-2">
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
