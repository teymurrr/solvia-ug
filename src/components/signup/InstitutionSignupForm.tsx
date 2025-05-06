
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { InstitutionSignupFormValues, institutionSignupSchema } from '@/schemas/institutionSignupSchema';
import { InstitutionInfoFields } from './InstitutionInfoFields';
import { EmailField } from './EmailField';
import { PasswordFields } from './PasswordFields';
import { TermsAgreement } from './TermsAgreement';

export const InstitutionSignupForm = () => {
  const { toast } = useToast();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm<InstitutionSignupFormValues>({
    resolver: zodResolver(institutionSignupSchema),
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

  const onSubmit = async (data: InstitutionSignupFormValues) => {
    try {
      await signUp(data.email, data.password, {
        name: data.institutionName,
        user_type: 'institution',
        institution_type: data.institutionType,
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InstitutionInfoFields form={form} />
        <EmailField form={form} />
        <PasswordFields form={form} />
        <TermsAgreement form={form} />
        
        <Button type="submit" className="w-full">
          Create institution account
        </Button>
      </form>
    </Form>
  );
};
