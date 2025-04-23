import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, Building2, MapPin, Globe } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth, UserType } from '@/contexts/AuthContext';

const signupSchema = z.object({
  institutionName: z.string().min(2, 'Institution name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  website: z.string().url('Please enter a valid URL').or(z.string().length(0)),
  location: z.string().min(5, 'Location must be at least 5 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and a number'),
  confirmPassword: z.string(),
  institutionType: z.string().min(2, 'Institution type must be at least 2 characters'),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const InstitutionSignup = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const { toast } = useToast();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      institutionName: '',
      email: '',
      website: '',
      location: '',
      password: '',
      confirmPassword: '',
      institutionType: '',
      terms: false,
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      await signUp(data.email, data.password, {
        first_name: data.institutionName,
        last_name: data.institutionType,
        user_type: 'institution',
        location: data.location,
        website: data.website,
      });
      
      toast({
        title: "Account created",
        description: "Your institution account has been created successfully.",
      });
      
      navigate('/auth');
    } catch (error) {
      console.error('Institution Signup error:', error);
      toast({
        title: "Signup Failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-md mx-auto py-12">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create an Institution Account</CardTitle>
            <CardDescription className="text-center">
              Enter your information to create your healthcare institution account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="institutionName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Name</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            placeholder="General Hospital" 
                            {...field}
                            className="pl-10" 
                          />
                        </FormControl>
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="institutionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Type</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Hospital, Clinic, Research Center" 
                          {...field}
                        />
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
                      <FormLabel>Location</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            placeholder="City, Country" 
                            {...field}
                            className="pl-10" 
                          />
                        </FormControl>
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            placeholder="contact@hospital.com" 
                            {...field}
                            className="pl-10" 
                          />
                        </FormControl>
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website (optional)</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            placeholder="https://www.hospital.com" 
                            {...field}
                            className="pl-10" 
                          />
                        </FormControl>
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            {...field}
                            className="pl-10"
                          />
                        </FormControl>
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)} 
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? 
                            <EyeOff className="h-4 w-4" /> : 
                            <Eye className="h-4 w-4" />
                          }
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            {...field}
                            className="pl-10"
                          />
                        </FormControl>
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <button 
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? 
                            <EyeOff className="h-4 w-4" /> : 
                            <Eye className="h-4 w-4" />
                          }
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium cursor-pointer">
                          I agree to the{' '}
                          <Link to="/terms" className="text-medical-700 hover:text-medical-800">
                            terms of service
                          </Link>
                          {' '}and{' '}
                          <Link to="/privacy" className="text-medical-700 hover:text-medical-800">
                            privacy policy
                          </Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">
                  Create institution account
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              Want to sign up as a professional?{" "}
              <Link to="/signup/professional" className="text-medical-700 hover:text-medical-800 font-medium">
                Professional signup
              </Link>
            </div>
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-medical-700 hover:text-medical-800 font-medium">
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default InstitutionSignup;
