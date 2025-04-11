
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase } from 'lucide-react';

// Define the form schema
const vacancyFormSchema = z.object({
  title: z.string().min(2, "Job title must be at least 2 characters."),
  department: z.string().min(2, "Department is required."),
  specialty: z.string().min(2, "Specialty is required."),
  contractType: z.string().min(1, "Contract type is required."),
  location: z.string().min(2, "Location is required."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  requirements: z.string().optional(),
  salary: z.string().optional(),
});

type VacancyFormValues = z.infer<typeof vacancyFormSchema>;

interface VacancyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: VacancyFormValues) => void;
  initialData?: Partial<VacancyFormValues>;
}

const VacancyForm: React.FC<VacancyFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialData = {
    title: "",
    department: "",
    specialty: "",
    contractType: "",
    location: "",
    description: "",
    requirements: "",
    salary: "",
  }
}) => {
  const { toast } = useToast();
  
  const form = useForm<VacancyFormValues>({
    resolver: zodResolver(vacancyFormSchema),
    defaultValues: initialData,
  });

  const handleSubmit = (data: VacancyFormValues) => {
    // In a real application, this would save to a database
    console.log("Vacancy data to save:", data);
    
    onSubmit(data);
    
    toast({
      title: "Vacancy Created",
      description: "Your job vacancy has been successfully created.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Vacancy</DialogTitle>
          <DialogDescription>
            Fill in the details for the new job opening at your institution.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Neurologist, Nurse Practitioner" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Neurology, Emergency" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialty</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Pediatric Neurology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contractType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select contract type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="temporary">Temporary</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <FormControl>
                      <Input placeholder="e.g. New York, USA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary Range (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. $80,000 - $100,000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the role, responsibilities, and what makes it unique..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirements (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List qualifications, experience, and skills needed..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Briefcase className="h-4 w-4 mr-2" />
                Create Vacancy
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default VacancyForm;
