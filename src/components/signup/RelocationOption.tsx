
import React from 'react';
import { FormField, FormItem, FormControl, FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { useLanguage } from '@/hooks/useLanguage';

interface RelocationOptionProps {
  form: UseFormReturn<any>;
}

export const RelocationOption: React.FC<RelocationOptionProps> = ({ form }) => {
  const { t } = useLanguage();
  return (
    <FormField
      control={form.control}
      name="isOpenToRelocation"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
          <FormControl>
            <Checkbox 
              checked={field.value} 
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="text-sm font-medium cursor-pointer">
              {t.auth.relocation}
            </FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
};
