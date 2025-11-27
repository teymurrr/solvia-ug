
import React, { useState } from 'react';
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
import { PasswordFields } from './PasswordFields';
import { TermsAgreement } from './TermsAgreement';
import { useLanguage } from '@/hooks/useLanguage';

export const ProfessionalSignupForm: React.FC = () => {
  const { toast } = useToast();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();
  
  const form = useForm<ProfessionalSignupFormValues>({
    resolver: zodResolver(professionalSignupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const onSubmit = async (data: ProfessionalSignupFormValues) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      
      await signUp(data.email, data.password, {
        first_name: data.firstName,
        last_name: data.lastName,
        user_type: 'professional',
      });

      // Store email for confirmation page
      localStorage.setItem('pendingConfirmationEmail', data.email);

      toast({
        title: t.common.success,
        description: t.auth.confirmEmailSent + ' ' + (data.email || ''),
      });
      
      navigate('/confirm-email');
    } catch (error: any) {
      console.error('Signup error:', error, '\nStatus:', error?.status, '\nMessage:', error?.message);
      
      let errorMessage = 'An error occurred during signup.';
      
      const msg: string | undefined = error?.message;
      const status: number | undefined = error?.status;
      
      if (msg) {
        if (status === 429 || /over_email_send_rate_limit|rate limit|too many/i.test(msg)) {
          errorMessage = 'Too many signup attempts. Please wait 1–2 minutes, then try again.';
        } else if (/User already registered/i.test(msg)) {
          errorMessage = 'This email is already registered. Please try logging in instead.';
        } else if (/Invalid email/i.test(msg)) {
          errorMessage = 'Please enter a valid email address.';
        } else if (/Password/i.test(msg)) {
          errorMessage = 'Password does not meet requirements. Please check your password.';
        } else {
          errorMessage = msg;
        }
      }
      
      toast({
        title: t.common.error,
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <NameFields form={form} />
        <EmailField form={form} />
        <PasswordFields form={form} />
        <TermsAgreement form={form} />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t.auth.creatingAccount : t.auth.createProfessionalAccount}
        </Button>
      </form>
    </Form>
  );
};
