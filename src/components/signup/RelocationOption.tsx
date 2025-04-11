
import React from 'react';
import { FormField, FormItem, FormControl, FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { ProfessionalSignupFormValues } from '@/schemas/professionalSignupSchema';

interface RelocationOptionProps {
  form: UseFormReturn<ProfessionalSignupFormValues>;
}

export const RelocationOption: React.FC<RelocationOptionProps> = ({ form }) => {
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
              I am open to relocation opportunities
            </FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
};
