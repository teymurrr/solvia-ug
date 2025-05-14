
import React from 'react';
import { User } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ProfessionalSignupFormValues } from '@/schemas/professionalSignupSchema';
import { useLanguage } from '@/hooks/useLanguage';

interface NameFieldsProps {
  form: UseFormReturn<ProfessionalSignupFormValues>;
}

export const NameFields: React.FC<NameFieldsProps> = ({ form }) => {
  const { t } = useLanguage();
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t.auth.firstName}</FormLabel>
            <div className="relative">
              <FormControl>
                <Input 
                  placeholder="John" 
                  {...field}
                  className="pl-10" 
                />
              </FormControl>
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t.auth.lastName}</FormLabel>
            <FormControl>
              <Input 
                placeholder="Doe" 
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
