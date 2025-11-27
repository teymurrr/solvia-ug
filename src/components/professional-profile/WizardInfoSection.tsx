
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from './types';
import { useLanguage } from '@/hooks/useLanguage';

interface WizardInfoSectionProps {
  form: UseFormReturn<ProfileFormValues>;
}

const targetCountries = [
  { id: 'germany', name: 'Germany', flag: '🇩🇪' },
  { id: 'austria', name: 'Austria', flag: '🇦🇹' },
  { id: 'spain', name: 'Spain', flag: '🇪🇸' },
  { id: 'italy', name: 'Italy', flag: '🇮🇹' },
  { id: 'france', name: 'France', flag: '🇫🇷' },
];

const studyCountries = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria', 'Bangladesh', 'Belgium',
  'Bolivia', 'Brazil', 'Bulgaria', 'Canada', 'Chile', 'China', 'Colombia', 'Costa Rica', 'Croatia',
  'Cuba', 'Czech Republic', 'Denmark', 'Ecuador', 'Egypt', 'Finland', 'France', 'Germany', 'Greece',
  'Hungary', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan', 'Jordan',
  'Kenya', 'Lebanon', 'Mexico', 'Morocco', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway', 'Pakistan',
  'Peru', 'Philippines', 'Poland', 'Portugal', 'Romania', 'Russia', 'Saudi Arabia', 'Serbia', 'South Africa',
  'South Korea', 'Spain', 'Sweden', 'Switzerland', 'Syria', 'Thailand', 'Tunisia', 'Turkey', 'Ukraine',
  'United Kingdom', 'United States', 'Venezuela', 'Vietnam'
];

const doctorTypes = [
  { id: 'general', label: 'General Practitioner' },
  { id: 'specialist', label: 'Specialist' },
  { id: 'nurse', label: 'Nurse' },
  { id: 'dentist', label: 'Dentist' },
  { id: 'other', label: 'Other' },
];

const documentsReadyOptions = [
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
  { id: 'unsure', label: 'Not sure' },
];

const languageLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', "I don't know"];

const WizardInfoSection: React.FC<WizardInfoSectionProps> = ({ form }) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2">
        {t?.dashboard?.profile?.homologationInfo || "Homologation Information"}
      </h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="targetCountry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t?.dashboard?.profile?.targetCountry || "Target Country"}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t?.dashboard?.profile?.selectTargetCountry || "Select target country"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {targetCountries.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.flag} {country.name}
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
          name="studyCountry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t?.dashboard?.profile?.studyCountry || "Country of Study"}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t?.dashboard?.profile?.selectStudyCountry || "Select study country"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[300px]">
                  {studyCountries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
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
          name="doctorType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t?.dashboard?.profile?.doctorType || "Professional Type"}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t?.dashboard?.profile?.selectDoctorType || "Select type"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {doctorTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
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
          name="documentsReady"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t?.dashboard?.profile?.documentsReady || "Documents Ready"}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t?.dashboard?.profile?.selectDocumentsStatus || "Select status"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {documentsReadyOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
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
          name="languageLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t?.dashboard?.profile?.languageLevel || "German Language Level"}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t?.dashboard?.profile?.selectLanguageLevel || "Select level"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {languageLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default WizardInfoSection;
