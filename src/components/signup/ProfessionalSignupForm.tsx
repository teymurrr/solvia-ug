
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
import { SpecialtyField } from './SpecialtyField';
import { PasswordFields } from './PasswordFields';
import { TermsAgreement } from './TermsAgreement';
import { RelocationOption } from './RelocationOption';
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
      specialty: '',
      terms: false,
      isOpenToRelocation: false,
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
        specialty: data.specialty,
        open_to_relocation: data.isOpenToRelocation,
      });

      toast({
        title: t.common.success,
        description: t.auth.confirmEmailSent + ' ' + (data.email || ''),
      });
      
      navigate('/confirm-email');
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: t.common.error,
        description: 'An error occurred during signup. This email might already be registered.',
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
        <SpecialtyField form={form} />
        <RelocationOption form={form} />
        <PasswordFields form={form} />
        <TermsAgreement form={form} />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t.auth.creatingAccount : t.auth.createProfessionalAccount}
        </Button>
      </form>
    </Form>
  );
};
