
import React from 'react';
import { Building2, MapPin, Globe } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { InstitutionSignupFormValues } from '@/schemas/institutionSignupSchema';

interface InstitutionInfoFieldsProps {
  form: UseFormReturn<InstitutionSignupFormValues>;
}

export const InstitutionInfoFields: React.FC<InstitutionInfoFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="institutionName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Institution Name</FormLabel>
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
            <FormLabel>Institution Type</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., Hospital, Clinic, Research Center" 
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
            <FormLabel>Location</FormLabel>
            <div className="relative">
              <FormControl>
                <Input 
                  placeholder="City, Country" 
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
            <FormLabel>Website (optional)</FormLabel>
            <div className="relative">
              <FormControl>
                <Input 
                  placeholder="https://www.hospital.com" 
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
