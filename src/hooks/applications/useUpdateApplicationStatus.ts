
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Application } from './types';

export const useUpdateApplicationStatus = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const updateApplicationStatus = async (
    applicationId: string, 
    newStatus: Application['status'],
    onSuccess?: (updatedApp: { id: string, status: Application['status'] }) => void
  ) => {
    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('applied_vacancies')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      // Call the success callback if provided
      if (onSuccess) {
        onSuccess({ id: applicationId, status: newStatus });
      }

      toast({
        title: 'Status updated',
        description: `Application status changed to ${newStatus}`,
      });

      return true;
    } catch (error: any) {
      console.error('Error updating application status:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update application status',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    updateApplicationStatus,
    submitting
  };
};
