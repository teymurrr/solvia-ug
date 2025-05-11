import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Link as LinkIcon } from 'lucide-react';

// Define validation schema
const formSchema = z.object({
  title: z.string().min(2, { message: "Job title is required" }),
  institution: z.string().min(2, { message: "Institution is required" }),
  department: z.string().min(2, { message: "Department is required" }),
  specialty: z.string().optional(),
  profession: z.string().optional(),
  contract_type: z.string({ required_error: "Contract type is required" }),
  job_type: z.string().optional(),
  location: z.string().min(2, { message: "Location is required" }),
  country: z.string().optional(),
  city: z.string().optional(),
  description: z.string().min(10, { message: "Description is required and must be at least 10 characters" }),
  requirements: z.string().min(5, { message: "Requirements are required" }),
  salary: z.string().optional(),
  application_link: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
});

// Adapter function to handle the contractType to contract_type transformation
export const adaptVacancyFormData = (formData) => {
  console.log("Adapting form data:", formData);
  
  // Format requirements into an array if it's a string
  if (typeof formData.requirements === 'string') {
    formData.requirements = formData.requirements
      .split('\n')
      .filter(line => line.trim() !== '');
  }

  // Copy contract_type to job_type if job_type is missing
  if (!formData.job_type && formData.contract_type) {
    formData.job_type = formData.contract_type;
  }

  // Convert contractType to contract_type if needed
  if (formData && formData.contractType !== undefined) {
    formData.contract_type = formData.contractType;
    delete formData.contractType;
  }

  // Clean up empty application link
  if (formData.application_link === '') {
    formData.application_link = null;
  }
  
  console.log("Adapted form data:", formData);
  return formData;
};

// Function to prepare vacancy data for the form
const prepareVacancyForForm = (vacancy) => {
  if (!vacancy) return null;

  // Convert requirements array to string for the form textarea
  let requirementsString = '';
  if (vacancy.requirements && Array.isArray(vacancy.requirements)) {
    requirementsString = vacancy.requirements.join('\n');
  } else if (typeof vacancy.requirements === 'string') {
    requirementsString = vacancy.requirements;
  }

  return {
    ...vacancy,
    requirements: requirementsString,
    application_link: vacancy.application_link || ''
  };
};

interface VacancyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<any>;
  isSubmitting?: boolean;
  userId?: string;
  editVacancy?: any;
  mode?: 'create' | 'edit';
}

const VacancyForm: React.FC<VacancyFormProps> = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isSubmitting = false,
  userId,
  editVacancy = null,
  mode = 'create'
}) => {
  const { toast } = useToast();
  const [internalSubmitting, setInternalSubmitting] = useState(false);
  const isEditMode = mode === 'edit' && editVacancy;
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      institution: "",
      department: "",
      specialty: "",
      profession: "",
      contract_type: "full-time",
      job_type: "",
      location: "",
      country: "",
      city: "",
      description: "",
      requirements: "",
      salary: "",
      application_link: "",
    },
  });

  // Set form values when editing an existing vacancy
  useEffect(() => {
    if (isEditMode && editVacancy) {
      const formattedVacancy = prepareVacancyForForm(editVacancy);
      if (formattedVacancy) {
        form.reset(formattedVacancy);
      }
    } else {
      // Reset form to defaults when not in edit mode
      form.reset({
        title: "",
        institution: "",
        department: "",
        specialty: "",
        profession: "",
        contract_type: "full-time",
        job_type: "",
        location: "",
        country: "",
        city: "",
        description: "",
        requirements: "",
        salary: "",
        application_link: "",
      });
    }
  }, [editVacancy, isEditMode, form, open]);

  const handleSubmit = async (values) => {
    try {
      console.log("Form values before adapting:", values);
      console.log("Current user ID:", userId);
      
      if (!userId) {
        console.error("No user ID available when submitting vacancy");
        toast({
          title: "Authentication error",
          description: "You need to be logged in to post vacancies. Please try signing in again.",
          variant: "destructive",
        });
        return;
      }
      
      setInternalSubmitting(true);
      const adaptedData = adaptVacancyFormData(values);
      
      // Include the ID when editing
      if (isEditMode && editVacancy) {
        adaptedData.id = editVacancy.id;
      }

      console.log("Adapted data being submitted:", adaptedData);
      
      const result = await onSubmit(adaptedData);
      
      if (result) {
        if (!isEditMode) {
          form.reset(); // Only reset if not editing
        }
        
        toast({
          title: isEditMode ? "Vacancy updated" : "Vacancy created",
          description: isEditMode 
            ? "Your vacancy has been updated successfully."
            : "Your vacancy has been posted successfully.",
        });
      }
    } catch (error) {
      console.error("Error submitting vacancy:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? 'update' : 'create'} vacancy. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setInternalSubmitting(false);
    }
  };

  const submitting = isSubmitting || internalSubmitting;
  const dialogTitle = isEditMode ? "Edit Vacancy" : "Post a New Vacancy";
  const dialogDescription = isEditMode 
    ? "Update the information for this job vacancy. Fields marked with * are required."
    : "Fill out the form below to create a new job vacancy. Fields marked with * are required.";
  const submitButtonText = isEditMode 
    ? (submitting ? "Updating..." : "Update Vacancy")
    : (submitting ? "Creating..." : "Create Vacancy");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Senior Nurse, Attending Physician" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution *</FormLabel>
                    <FormControl>
                      <Input placeholder="Hospital or clinic name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Cardiology, Emergency" {...field} />
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
                      <Input placeholder="e.g., Pediatric Cardiology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="profession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profession</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Nurse, Physician, Technician" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contract_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Type *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
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
                        <SelectItem value="locum">Locum</SelectItem>
                        <SelectItem value="permanent">Permanent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
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
                    <FormLabel>Full Location *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Downtown Medical Center, New York" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* External Application Link */}
            <FormField
              control={form.control}
              name="application_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    External Application Link
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://your-company-careers.com/job/12345" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground">
                    If provided, applicants will be redirected to this URL instead of using the Solvia application form.
                  </p>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary Range</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., $80,000 - $100,000 per year" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the job role, responsibilities, and expectations..." 
                      className="min-h-[120px]"
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
                  <FormLabel>Requirements *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List requirements, one per line. E.g., 
- MD degree from an accredited institution
- Board certification in relevant specialty
- 3+ years of clinical experience" 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  submitButtonText
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default VacancyForm;
