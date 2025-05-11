import React, { useState } from 'react';
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
import { Loader2 } from 'lucide-react';

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
  application_deadline: z.string().optional().refine(val => {
    // Empty string is valid (will be converted to null)
    if (!val || val.trim() === '') return true;
    // Otherwise check if it's a valid date
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, { message: "Invalid date format" }),
  salary: z.string().optional(),
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

  // Handle empty application_deadline
  if (formData.application_deadline === '') {
    formData.application_deadline = null;
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
  
  console.log("Adapted form data:", formData);
  return formData;
};

interface VacancyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<any>;
  isSubmitting?: boolean;
  userId?: string;
}

const VacancyForm: React.FC<VacancyFormProps> = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isSubmitting = false,
  userId 
}) => {
  const { toast } = useToast();
  const [internalSubmitting, setInternalSubmitting] = useState(false);
  
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
      application_deadline: "",
      salary: "",
    },
  });

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
      console.log("Adapted data being submitted:", adaptedData);
      
      const result = await onSubmit(adaptedData);
      
      if (result) {
        form.reset();
        toast({
          title: "Vacancy created",
          description: "Your vacancy has been posted successfully.",
        });
      }
    } catch (error) {
      console.error("Error submitting vacancy:", error);
      toast({
        title: "Error",
        description: "Failed to create vacancy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setInternalSubmitting(false);
    }
  };

  const submitting = isSubmitting || internalSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post a New Vacancy</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new job vacancy. Fields marked with * are required.
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
              name="application_deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application Deadline</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      onChange={(e) => {
                        // Allow clearing the field (empty string will be handled appropriately)
                        field.onChange(e.target.value);
                      }}
                    />
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
                    Creating...
                  </>
                ) : (
                  "Create Vacancy"
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
