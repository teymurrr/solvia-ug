
import React from 'react';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { ProfileFormValues } from './types';
import { useLanguage } from '@/hooks/useLanguage';

interface ExperienceSectionProps {
  form: UseFormReturn<ProfileFormValues>;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ form }) => {
  const { t } = useLanguage();
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experiences"
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{t?.dashboard?.profile?.experience || "Professional Experience"}</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => append({ hospital: "", location: "", role: "", startDate: "", endDate: "", current: false })}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t?.dashboard?.profile?.addExperience || "Add Experience"}
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="border rounded-md p-4 space-y-4">
          <div className="flex justify-between">
            <h4 className="font-medium">{t?.dashboard?.profile?.experienceCount || "Experience"} {index + 1}</h4>
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
              name={`experiences.${index}.hospital`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t?.dashboard?.profile?.hospital || "Hospital/Institution"}</FormLabel>
                  <FormControl>
                    <Input placeholder={t?.dashboard?.profile?.hospitalPlaceholder || "General Hospital"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`experiences.${index}.location`}
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

            <FormField
              control={form.control}
              name={`experiences.${index}.role`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t?.dashboard?.profile?.role || "Role"}</FormLabel>
                  <FormControl>
                    <Input placeholder={t?.dashboard?.profile?.rolePlaceholder || "Senior Cardiologist"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`experiences.${index}.startDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t?.dashboard?.profile?.startDate || "Start Date"}</FormLabel>
                  <FormControl>
                    <Input type="month" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`experiences.${index}.current`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        // Clear end date if current is checked
                        if (checked) {
                          form.setValue(`experiences.${index}.endDate`, "");
                        }
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t?.dashboard?.profile?.currentlyWorking || "Currently working here"}</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {!form.watch(`experiences.${index}.current`) && (
              <FormField
                control={form.control}
                name={`experiences.${index}.endDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t?.dashboard?.profile?.endDate || "End Date"}</FormLabel>
                    <FormControl>
                      <Input type="month" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExperienceSection;
