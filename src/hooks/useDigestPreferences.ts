import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DigestPreferences {
  id: string;
  user_id: string;
  enabled: boolean;
  frequency: 'weekly' | 'daily' | 'never';
  categories: string[];
  created_at: string;
  updated_at: string;
}

const DEFAULT_CATEGORIES = ['homologation', 'language', 'fsp', 'life-abroad', 'job-search', 'journey'];

export const useDigestPreferences = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['digest-preferences', user?.id],
    queryFn: async (): Promise<DigestPreferences | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('digest_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as DigestPreferences | null;
    },
    enabled: !!user?.id,
  });
};

export const useUpdateDigestPreferences = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prefs: { enabled: boolean; frequency: string; categories: string[] }) => {
      if (!user?.id) throw new Error('Not authenticated');

      // Upsert
      const { data, error } = await supabase
        .from('digest_preferences')
        .upsert(
          {
            user_id: user.id,
            enabled: prefs.enabled,
            frequency: prefs.frequency,
            categories: prefs.categories,
          },
          { onConflict: 'user_id' }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['digest-preferences'] });
    },
  });
};

export { DEFAULT_CATEGORIES };
