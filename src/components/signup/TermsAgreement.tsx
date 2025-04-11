
import React from 'react';
import { Link } from 'react-router-dom';
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { ProfessionalSignupFormValues } from '@/schemas/professionalSignupSchema';

interface TermsAgreementProps {
  form: UseFormReturn<ProfessionalSignupFormValues>;
}

export const TermsAgreement: React.FC<TermsAgreementProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="terms"
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
              I agree to the{' '}
              <Link to="/terms" className="text-medical-700 hover:text-medical-800">
                terms of service
              </Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-medical-700 hover:text-medical-800">
                privacy policy
              </Link>
            </FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};
