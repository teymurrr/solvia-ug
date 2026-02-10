import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';

export const useVacancyApplication = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const submitApplication = async (vacancyId: string, message?: string) => {
    if (!user) return false;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('applied_vacancies')
        .insert({
          user_id: user.id,
          vacancy_id: vacancyId,
          application_data: message ? { message } : null,
          status: 'pending',
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: t?.vacancies?.applyDialog?.alreadyApplied || "Already applied",
            description: t?.vacancies?.applyDialog?.alreadyAppliedDesc || "You have already expressed interest in this position.",
          });
          return true; // Still counts as applied
        }
        throw error;
      }

      toast({
        title: t?.vacancies?.applyDialog?.successTitle || "Interest submitted!",
        description: t?.vacancies?.applyDialog?.successDesc || "We've received your interest! Our team will match you with this opportunity as part of your homologation journey.",
      });
      return true;
    } catch (err) {
      console.error('Error submitting application:', err);
      toast({
        title: t?.common?.error || "Error",
        description: t?.vacancies?.applyDialog?.errorDesc || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitApplication, isSubmitting };
};
