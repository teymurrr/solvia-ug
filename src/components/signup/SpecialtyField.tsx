
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ProfessionalSignupFormValues } from '@/schemas/professionalSignupSchema';

interface SpecialtyFieldProps {
  form: UseFormReturn<ProfessionalSignupFormValues>;
}

export const SpecialtyField: React.FC<SpecialtyFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="specialty"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Medical Specialty</FormLabel>
          <FormControl>
            <Input 
              placeholder="e.g., Cardiology, Pediatrics" 
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
