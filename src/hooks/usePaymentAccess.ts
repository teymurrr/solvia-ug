import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface PaidCountry {
  target_country: string;
  product_type: string;
  created_at: string;
}

interface PaymentAccessState {
  isLoading: boolean;
  paidCountries: PaidCountry[];
  hasPaidAccess: (country: string) => boolean;
  refetch: () => Promise<void>;
}

export const usePaymentAccess = (): PaymentAccessState => {
  const { user, isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [paidCountries, setPaidCountries] = useState<PaidCountry[]>([]);

  const fetchPaidCountries = useCallback(async () => {
    if (!isLoggedIn || !user?.id) {
      setPaidCountries([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Query payments table directly for completed payments
      const { data, error } = await supabase
        .from('payments')
        .select('target_country, product_type, created_at')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .in('product_type', ['homologation', 'language_prep', 'premium_support'])
        .not('target_country', 'is', null);

      if (error) {
        console.error('Error fetching paid countries:', error);
        setPaidCountries([]);
      } else {
        // Remove duplicates by target_country, keeping the most recent
        const uniqueCountries = data?.reduce((acc: PaidCountry[], curr) => {
          const existing = acc.find(p => p.target_country === curr.target_country);
          if (!existing) {
            acc.push(curr as PaidCountry);
          }
          return acc;
        }, []) || [];
        
        setPaidCountries(uniqueCountries);
      }
    } catch (error) {
      console.error('Error in fetchPaidCountries:', error);
      setPaidCountries([]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn, user?.id]);

  useEffect(() => {
    fetchPaidCountries();
  }, [fetchPaidCountries]);

  const hasPaidAccess = useCallback((country: string): boolean => {
    return paidCountries.some(p => p.target_country === country);
  }, [paidCountries]);

  return {
    isLoading,
    paidCountries,
    hasPaidAccess,
    refetch: fetchPaidCountries,
  };
};

export default usePaymentAccess;
