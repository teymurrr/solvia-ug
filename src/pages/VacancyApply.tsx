
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useProfileData } from '@/components/professional-profile/hooks/useProfileData';
import { ArrowLeft, Upload, FileUp, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// This would come from an API in a real application
const getVacancyById = (id: string) => {
  return {
    id,
    title: 'Neurologist',
    institution: 'Berlin Medical Center',
    location: 'Berlin, Germany',
    jobType: 'Full-time',
  };
};

// Create schema for form validation
const applicationSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional(),
  coverLetter: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

const VacancyApply = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profileData, loading } = useProfileData();
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get vacancy details (in a real app this would be from an API)
  const vacancy = getVacancyById(id || '');

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: profileData?.firstName || '',
      lastName: profileData?.lastName || '',
      email: profileData?.email || '',
      phone: '', // Default to empty string since phone might not exist in profileData
      coverLetter: '',
    },
  });

  // Update form values when profile data loads
  React.useEffect(() => {
    if (profileData) {
      form.reset({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        email: profileData.email || '',
        phone: '', // Default to empty string since phone might not exist in profileData
        coverLetter: '',
      });
    }
  }, [profileData, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data: ApplicationFormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real application, this would send the data to an API
      console.log('Application data:', data);
      console.log('CV file:', cvFile);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Application submitted",
        description: "Your application has been successfully submitted",
      });
      
      // Navigate back to the dashboard
      navigate('/dashboard/professional');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8 flex justify-center items-center min-h-[500px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Link to={`/vacancies/${id}`} className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Vacancy
        </Link>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Apply for Position</h1>
          <p className="text-muted-foreground mt-1">
            {vacancy.title} at {vacancy.institution} ({vacancy.location})
          </p>
        </div>
        
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Application Form</CardTitle>
            <CardDescription>
              Complete the form below to apply for this position. Fields marked with * are required.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your first name" {...field} />
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
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+1 234 567 890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* CV Upload */}
                <div className="space-y-2">
                  <Label htmlFor="cv">Upload CV/Resume *</Label>
                  <div className="flex items-center">
                    <Label
                      htmlFor="cv"
                      className={`cursor-pointer flex items-center justify-center w-full h-32 px-4 transition border-2 border-dashed rounded-md appearance-none ${
                        cvFile ? 'bg-primary/5 border-primary' : 'bg-background hover:border-primary'
                      } focus:outline-none`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        {cvFile ? (
                          <>
                            <Check className="h-8 w-8 text-primary" />
                            <span className="text-sm text-primary">{cvFile.name}</span>
                          </>
                        ) : (
                          <>
                            <FileUp className="h-8 w-8 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Click to upload your CV/Resume (PDF, DOC, DOCX)
                            </span>
                          </>
                        )}
                      </div>
                    </Label>
                    <Input
                      id="cv"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                </div>
                
                {/* Cover Letter / Notes */}
                <FormField
                  control={form.control}
                  name="coverLetter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Letter / Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write any additional information you'd like to include with your application..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/vacancies/${id}`)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default VacancyApply;
