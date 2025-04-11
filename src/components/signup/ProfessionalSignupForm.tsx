
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { professionalSignupSchema, ProfessionalSignupFormValues } from '@/schemas/professionalSignupSchema';
import { NameFields } from './NameFields';
import { EmailField } from './EmailField';
import { SpecialtyField } from './SpecialtyField';
import { RelocationOption } from './RelocationOption';
import { PasswordFields } from './PasswordFields';
import { TermsAgreement } from './TermsAgreement';

export const ProfessionalSignupForm: React.FC = () => {
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm<ProfessionalSignupFormValues>({
    resolver: zodResolver(professionalSignupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      specialty: '',
      isOpenToRelocation: false,
      terms: false,
    },
  });

  const onSubmit = (data: ProfessionalSignupFormValues) => {
    console.log('Professional Signup data:', data);
    
    // Save professional data to localStorage
    const existingProfessionals = localStorage.getItem('professionals');
    const professionals = existingProfessionals ? JSON.parse(existingProfessionals) : [];
    
    // Check if professional with this email already exists
    const professionalExists = professionals.some(
      (prof: any) => prof.email === data.email
    );
    
    if (professionalExists) {
      toast({
        title: "Account already exists",
        description: "An account with this email already exists.",
        variant: "destructive"
      });
      return;
    }
    
    // Add new professional to the list with a unique ID
    professionals.push({
      id: Date.now().toString(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      specialty: data.specialty,
      isOpenToRelocation: data.isOpenToRelocation || false,
      registeredAt: new Date().toISOString(),
    });
    
    // Save back to localStorage
    localStorage.setItem('professionals', JSON.stringify(professionals));
    
    login('professional');
    
    toast({
      title: "Account created",
      description: "Your professional account has been created successfully.",
    });
    
    navigate('/dashboard/professional');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <NameFields form={form} />
        <EmailField form={form} />
        <SpecialtyField form={form} />
        <RelocationOption form={form} />
        <PasswordFields form={form} />
        <TermsAgreement form={form} />
        
        <Button type="submit" className="w-full">
          Create professional account
        </Button>
      </form>
    </Form>
  );
};
