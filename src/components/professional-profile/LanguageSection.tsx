
import React, { useState, useMemo } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Upload, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { ProfileFormValues } from './types';
import { availableLanguages, DEFAULT_LANGUAGES, getSafeLanguages } from '@/data/languages';

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
  const [openCommandMenus, setOpenCommandMenus] = useState<{ [key: number]: boolean }>({});
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "languages",
  });

  // Create a memoized safe language options array
  const languageOptions = useMemo(() => {
    try {
      // Make sure we always have a valid array, even if availableLanguages is somehow undefined
      return getSafeLanguages();
    } catch (error) {
      console.error("Error loading language options:", error);
      return DEFAULT_LANGUAGES;
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
                  <FormControl>
                    <Popover
                      open={openCommandMenus[index]}
                      onOpenChange={(open) => {
                        setOpenCommandMenus((prev) => ({ ...prev, [index]: open }));
                      }}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {field.value || "Select language"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search language..." />
                          <CommandEmpty>No language found.</CommandEmpty>
                          <CommandGroup>
                            {languageOptions.length > 0 ? (
                              languageOptions.map((language) => (
                                <CommandItem
                                  key={language}
                                  value={language}
                                  onSelect={() => {
                                    field.onChange(language);
                                    setOpenCommandMenus((prev) => ({ ...prev, [index]: false }));
                                  }}
                                >
                                  {language}
                                </CommandItem>
                              ))
                            ) : (
                              <CommandItem value="no-options">
                                No languages available
                              </CommandItem>
                            )}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
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
