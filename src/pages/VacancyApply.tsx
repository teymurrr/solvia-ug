import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Vacancy } from '@/hooks/useVacancies';
import { queryParamsToState, isSafari, stateToQueryParams, createDashboardReturnState } from '@/utils/browserDetection';

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
  const location = useLocation();
  const { toast } = useToast();
  const { profileData, loading } = useProfileData();
  const { user, session } = useAuth();
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [loadingVacancy, setLoadingVacancy] = useState(true);
  const [redirected, setRedirected] = useState(false);
  
  console.log('[VacancyApply] Starting application page with URL:', window.location.href);
  console.log('[VacancyApply] Location state:', location.state);
  
  // Create form before using it
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '', 
      coverLetter: '',
    },
  });
  
  // Combine state from both React Router's location.state and URL query parameters
  // This ensures compatibility with both Safari and other browsers
  const routerState = location.state || {};
  const queryState = queryParamsToState();
  
  console.log('[VacancyApply] Browser is Safari:', isSafari());
  console.log('[VacancyApply] Router state:', routerState);
  console.log('[VacancyApply] Query params state:', queryState);
  
  // Combine both sources of state
  const combinedState = {...routerState, ...queryState};
  
  // Check if user came from the dashboard - ensure this is correctly parsed from all sources
  const fromDashboard = 
    routerState.fromDashboard === true || 
    queryState.fromDashboard === true || 
    queryState.fromDashboard === 'true' ||
    routerState.directToDashboard === true ||
    queryState.directToDashboard === true ||
    queryState.directToDashboard === 'true';
    
  // Preserve search state and pagination from the dashboard
  const searchQuery = combinedState.searchQuery || '';
  const currentPage = Number(combinedState.currentPage || 1);
  const selectedFilters = combinedState.selectedFilters || {};
  
  // New flag to indicate we should always go back to dashboard
  const directToDashboard = fromDashboard || 
                          combinedState.directToDashboard === true ||
                          combinedState.directToDashboard === 'true';

  console.log('[VacancyApply] Combined state:', { 
    fromDashboard, 
    directToDashboard,
    searchQuery, 
    currentPage, 
    selectedFilters 
  });

  // Fetch the vacancy details from Supabase
  useEffect(() => {
    const fetchVacancy = async () => {
      if (id) {
        setLoadingVacancy(true);
        const { data, error } = await supabase
          .from('vacancies')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          console.error('[VacancyApply] Error fetching vacancy:', error);
          toast({
            title: "Error",
            description: "Failed to load vacancy details",
            variant: "destructive",
          });
        } else {
          console.log('[VacancyApply] Vacancy data loaded:', data);
          setVacancy(data as Vacancy);
        }
        setLoadingVacancy(false);
      }
    };
    
    fetchVacancy();
  }, [id, toast]);

  // Update form values when profile data loads
  useEffect(() => {
    if (profileData) {
      form.reset({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        email: profileData.email || '',
        phone: profileData.phone || '', // This will work now that we added phone to the type
        coverLetter: '',
      });
    }
  }, [profileData, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleCancel = () => {
    console.log('[VacancyApply] Handling cancel with fromDashboard:', fromDashboard, 'directToDashboard:', directToDashboard);
    
    // IMPORTANT: Always go back to dashboard if fromDashboard or directToDashboard is true
    if (fromDashboard || directToDashboard) {
      // Create a state object for dashboard navigation
      const state = createDashboardReturnState(true, {
        activeTab: 'vacancies',
        searchQuery,
        currentPage,
        selectedFilters
      });
      
      // Check if we need to use query params for navigation (Safari)
      if (isSafari()) {
        // For Safari, create state as query params
        const queryString = stateToQueryParams(state);
        console.log('[VacancyApply] Navigating back to dashboard with query params:', queryString);
        navigate(`/dashboard/professional${queryString}`);
      } else {
        // For other browsers, use state object
        console.log('[VacancyApply] Navigating back to dashboard with state object');
        navigate('/dashboard/professional', { state });
      }
    } else {
      // When coming from somewhere else, go back to that vacancy detail
      const state = {
        fromDashboard,
        searchQuery,
        currentPage,
        selectedFilters
      };
      
      if (isSafari()) {
        // For Safari, use query params
        const queryString = stateToQueryParams(state);
        console.log('[VacancyApply] Navigating back to vacancy with query params:', queryString);
        navigate(`/vacancies/${id}${queryString}`);
      } else {
        // For other browsers, use state object
        console.log('[VacancyApply] Navigating back to vacancy with state object');
        navigate(`/vacancies/${id}`, { state });
      }
    }
  };

  const onSubmit = async (data: ApplicationFormValues) => {
    if (!user || !session) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to apply for vacancies",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('[VacancyApply] Submitting application data:', data);
      console.log('[VacancyApply] CV file:', cvFile);
      
      // Save the application in the database
      const { error } = await supabase
        .from('applied_vacancies')
        .insert({
          user_id: user.id,
          vacancy_id: id,
          status: 'pending',
          application_data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone || '',
            coverLetter: data.coverLetter || '',
            cvFileName: cvFile ? cvFile.name : null
          }
        });
      
      if (error) {
        console.error('[VacancyApply] Error submitting application:', error);
        throw error;
      }
      
      toast({
        title: "Application submitted",
        description: "Your application has been successfully submitted",
      });
      
      // ALWAYS navigate back to the dashboard after successful application
      // Create a state object for dashboard navigation
      const state = createDashboardReturnState(true, {
        activeTab: 'saved',
        savedTabView: 'applied',
        searchQuery,
        currentPage,
        selectedFilters,
        applicationSubmitted: true
      });
      
      if (isSafari()) {
        const queryString = stateToQueryParams(state);
        console.log('[VacancyApply] Post-submission: Navigating to dashboard with query params:', queryString);
        navigate(`/dashboard/professional${queryString}`);
      } else {
        console.log('[VacancyApply] Post-submission: Navigating to dashboard with state object');
        navigate('/dashboard/professional', { state });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle redirection to external application link - CRITICAL for Safari
  useEffect(() => {
    // If we have a vacancy with an external link and haven't redirected yet
    if (vacancy?.application_link && !redirected) {
      // Mark as redirected to prevent infinite loop
      setRedirected(true); 
      console.log('[VacancyApply] External application link found, opening:', vacancy.application_link);
      
      // Open external link in new tab
      window.open(vacancy.application_link, '_blank');
      
      // IMMEDIATELY redirect back to dashboard (don't wait for user interaction)
      console.log('[VacancyApply] Immediately redirecting back to dashboard after opening external link');
      
      // Create a state object for dashboard navigation
      const state = createDashboardReturnState(true, {
        activeTab: 'vacancies',
        externalApplication: true,
        vacancyTitle: vacancy.title
      });
      
      if (isSafari()) {
        const queryString = stateToQueryParams(state);
        console.log('[VacancyApply] External application: Navigating to dashboard with query params:', queryString);
        navigate(`/dashboard/professional${queryString}`);
      } else {
        console.log('[VacancyApply] External application: Navigating to dashboard with state object');
        navigate('/dashboard/professional', { state });
      }
    }
  }, [vacancy, navigate, redirected]);

  // Show loading until data is fetched
  if (loading || loadingVacancy) {
    return (
      <MainLayout>
        <div className="container py-8 flex justify-center items-center min-h-[500px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  // Always render the same components with the same conditional structure
  // Use inline conditional rendering instead of early returns to maintain hook order
  return (
    <MainLayout>
      {vacancy?.application_link ? (
        <div className="container py-8 flex justify-center items-center min-h-[500px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="ml-4">Redirecting to external application...</p>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <button 
            onClick={handleCancel}
            className="inline-flex items-center text-primary hover:underline mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {fromDashboard || directToDashboard ? 'Back to Dashboard' : 'Back to Vacancy'}
          </button>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Apply for Position</h1>
            <p className="text-muted-foreground mt-1">
              {vacancy?.title || 'Job Position'} at {vacancy?.institution || 'Institution'} ({vacancy?.location || 'Location'})
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
                  {/* Form fields - keep structure for consistency */}
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
                      onClick={handleCancel}
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
      )}
    </MainLayout>
  );
};

export default VacancyApply;
