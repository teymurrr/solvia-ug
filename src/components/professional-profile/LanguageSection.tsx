
import React, { useState, useMemo } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Upload, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { ProfileFormValues } from './types';
import { DEFAULT_LANGUAGES } from '@/data/languages';

interface LanguageSectionProps {
  form: UseFormReturn<ProfileFormValues>;
  languageLevels: string[];
  handleLanguageCertificateChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
}

const LanguageSection: React.FC<LanguageSectionProps> = ({ 
  form, 
  languageLevels,
  handleLanguageCertificateChange 
}) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "languages",
  });

  // Create a memoized safe language options array
  const languageOptions = useMemo(() => {
    try {
      // Define a fallback list of languages in case there's an issue
      return DEFAULT_LANGUAGES || [
        "English", "Spanish", "French", "German", "Italian", 
        "Portuguese", "Dutch", "Russian", "Chinese", "Japanese", 
        "Arabic", "Hindi", "Bengali", "Polish", "Ukrainian", 
        "Romanian", "Greek", "Swedish", "Norwegian", "Finnish"
      ];
    } catch (error) {
      console.error("Error loading language options:", error);
      return [
        "English", "Spanish", "French", "German", "Italian", 
        "Portuguese", "Dutch", "Russian", "Chinese", "Japanese"
      ];
    }
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Language Skills</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => append({ language: "", level: "A1", certificate: "" })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Language
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="border rounded-md p-4 space-y-4">
          <div className="flex justify-between">
            <h4 className="font-medium">Language {index + 1}</h4>
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
                  <FormLabel>Language</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[300px]">
                      {languageOptions && languageOptions.length > 0 ? (
                        languageOptions.map((language) => (
                          <SelectItem key={language} value={language}>
                            {language}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-options" disabled>
                          No languages available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`languages.${index}.level`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
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
              <FormLabel>Certificate (optional)</FormLabel>
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
                  Upload Certificate
                </Button>
                {form.watch(`languages.${index}.certificate`) && (
                  <span className="text-sm text-green-600 flex items-center">
                    <Check className="h-4 w-4 mr-1" /> Certificate uploaded
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
