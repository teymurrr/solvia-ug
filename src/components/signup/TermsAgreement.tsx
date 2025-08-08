
import React from 'react';
import { Link } from 'react-router-dom';
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { useLanguage } from '@/hooks/useLanguage';

interface TermsAgreementProps {
  form: UseFormReturn<any>;
}

export const TermsAgreement: React.FC<TermsAgreementProps> = ({ form }) => {
  const { t } = useLanguage();
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
              {t.auth.termsAgree}
            </FormLabel>
            <div className="text-xs">
              <Link to="/terms" className="text-medical-700 hover:text-medical-800">
                {t.footer.termsOfService}
              </Link>
              {' · '}
              <Link to="/privacy" className="text-medical-700 hover:text-medical-800">
                {t.footer.privacyPolicy}
              </Link>
            </div>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};
