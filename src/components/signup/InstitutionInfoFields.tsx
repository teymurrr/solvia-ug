
import React from 'react';
import { Building2, MapPin, Globe } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { InstitutionSignupFormValues } from '@/schemas/institutionSignupSchema';
import { useLanguage } from '@/hooks/useLanguage';

interface InstitutionInfoFieldsProps {
  form: UseFormReturn<InstitutionSignupFormValues>;
}

export const InstitutionInfoFields: React.FC<InstitutionInfoFieldsProps> = ({ form }) => {
  const { t } = useLanguage();
  
  return (
    <>
      <FormField
        control={form.control}
        name="institutionName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t.auth.institutionName}</FormLabel>
            <div className="relative">
              <FormControl>
                <Input 
                  placeholder="General Hospital" 
                  {...field}
                  className="pl-10" 
                />
              </FormControl>
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="institutionType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t.auth.institutionType}</FormLabel>
            <FormControl>
              <Input 
                placeholder={t.auth.institutionTypePlaceholder}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t.auth.location}</FormLabel>
            <div className="relative">
              <FormControl>
                <Input 
                  placeholder={t.auth.locationPlaceholder}
                  {...field}
                  className="pl-10" 
                />
              </FormControl>
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t.auth.website}</FormLabel>
            <div className="relative">
              <FormControl>
                <Input 
                  placeholder={t.auth.websitePlaceholder}
                  {...field}
                  className="pl-10" 
                />
              </FormControl>
              <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
