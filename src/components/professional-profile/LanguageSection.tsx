
import React from 'react';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Check, Plus, Trash2, Upload } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfileFormValues } from './types';
import { useLanguage } from '@/hooks/useLanguage';

interface LanguageSectionProps {
  form: UseFormReturn<ProfileFormValues>;
  handleLanguageCertificateChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  languageLevels: string[];
}

const LanguageSection: React.FC<LanguageSectionProps> = ({ form, handleLanguageCertificateChange, languageLevels }) => {
  const { t } = useLanguage();
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "languages"
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{t?.dashboard?.profile?.languages || "Language Skills"}</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => append({ language: "", level: "A1", certificate: "" })}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t?.dashboard?.profile?.addLanguage || "Add Language"}
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="border rounded-md p-4 space-y-4">
          <div className="flex justify-between">
            <h4 className="font-medium">{t?.dashboard?.profile?.languageCount || "Language"} {index + 1}</h4>
            {fields.length > 1 && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name={`languages.${index}.language`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t?.dashboard?.profile?.languageName || "Language"}</FormLabel>
                  <FormControl>
                    <Input placeholder={t?.dashboard?.profile?.languageNamePlaceholder || "English"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`languages.${index}.level`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t?.dashboard?.profile?.languageLevel || "Level"}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t?.dashboard?.profile?.selectLevel || "Select level"} />
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

            <div className="md:col-span-2">
              <FormLabel>{t?.dashboard?.profile?.certificate || "Certificate"} ({t?.common?.optional || "optional"})</FormLabel>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id={`languageCertificate-${index}`}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => handleLanguageCertificateChange(e, index)}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.getElementById(`languageCertificate-${index}`)?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t?.dashboard?.profile?.uploadCertificate || "Upload Certificate"}
                </Button>
                {form.watch(`languages.${index}.certificate`) && (
                  <span className="text-sm text-green-600 flex items-center">
                    <Check className="h-4 w-4 mr-1" /> {t?.dashboard?.profile?.certificateUploaded || "Certificate uploaded"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LanguageSection;
