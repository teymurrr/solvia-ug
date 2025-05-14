
import React from 'react';
import { Mail } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ProfessionalSignupFormValues } from '@/schemas/professionalSignupSchema';
import { useLanguage } from '@/hooks/useLanguage';

interface EmailFieldProps {
  form: UseFormReturn<ProfessionalSignupFormValues>;
}

export const EmailField: React.FC<EmailFieldProps> = ({ form }) => {
  const { t } = useLanguage();
  
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t.auth.email}</FormLabel>
          <div className="relative">
            <FormControl>
              <Input 
                placeholder="name@example.com" 
                {...field}
                className="pl-10" 
              />
            </FormControl>
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
