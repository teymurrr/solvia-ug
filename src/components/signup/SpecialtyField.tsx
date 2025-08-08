
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { useLanguage } from '@/hooks/useLanguage';

interface SpecialtyFieldProps {
  form: UseFormReturn<any>;
}

export const SpecialtyField: React.FC<SpecialtyFieldProps> = ({ form }) => {
  const { t } = useLanguage();
  return (
    <FormField
      control={form.control}
      name="specialty"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t.auth.specialty}</FormLabel>
          <FormControl>
            <Input 
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
