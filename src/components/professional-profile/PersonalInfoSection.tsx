
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from './types';
import { useLanguage } from '@/hooks/useLanguage';

interface PersonalInfoSectionProps {
  form: UseFormReturn<ProfileFormValues>;
  professionOptions: string[];
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ form, professionOptions }) => {
  const { t } = useLanguage();
  
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t?.dashboard?.profile?.firstName || "First Name"}</FormLabel>
              <FormControl>
                <Input placeholder={t?.dashboard?.profile?.firstNamePlaceholder || "John"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t?.dashboard?.profile?.lastName || "Last Name"}</FormLabel>
              <FormControl>
                <Input placeholder={t?.dashboard?.profile?.lastNamePlaceholder || "Doe"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profession"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t?.dashboard?.profile?.profession || "Profession"}</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t?.dashboard?.profile?.selectProfession || "Select profession"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {professionOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specialty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t?.dashboard?.profile?.specialty || "Specialty"}</FormLabel>
              <FormControl>
                <Input placeholder={t?.dashboard?.profile?.specialtyPlaceholder || "Cardiologist"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t?.dashboard?.contact?.email || "Email"}</FormLabel>
              <FormControl>
                <Input placeholder={t?.dashboard?.profile?.emailPlaceholder || "name@example.com"} {...field} />
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
              <FormLabel>{t?.dashboard?.profile?.location || "Location"}</FormLabel>
              <FormControl>
                <Input placeholder={t?.dashboard?.profile?.locationPlaceholder || "New York, USA"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="activelySearching"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>{t?.dashboard?.profile?.activelySearching || "Actively searching for a new role"}</FormLabel>
              <p className="text-sm text-muted-foreground">
                {t?.dashboard?.profile?.activelySearchingDesc || "This will highlight your profile to potential employers"}
              </p>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="openToRelocation"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>{t?.dashboard?.profile?.openToRelocation || "Open to relocation"}</FormLabel>
              <p className="text-sm text-muted-foreground">
                {t?.dashboard?.profile?.openToRelocationDesc || "Indicate if you're willing to relocate for a suitable position"}
              </p>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="about"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t?.dashboard?.profile?.about || "About"}</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={t?.dashboard?.profile?.aboutPlaceholder || "Share information about your professional interests, research, or career goals..."} 
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default PersonalInfoSection;
