
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import SEO from '@/components/SEO';

const Contact = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const formSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    mobile: z.string().optional(),
    country: z.string().min(2, 'Please enter your country'),
    notes: z.string().min(10, 'Please provide more details in your message'),
  });

  type ContactFormValues = z.infer<typeof formSchema>;
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      mobile: '',
      country: '',
      notes: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      // Here you would typically send this data to your backend
      console.log('Form submitted:', data);
      
      toast({
        title: t.contact.success,
        description: t.contact.successDescription,
      });
      
      // Redirect to home page after successful submission
      navigate('/');
    } catch (error) {
      toast({
        title: t.contact.error,
        description: t.contact.errorDescription,
        variant: "destructive",
      });
    }
  };

  const seoData = (t as any)?.seo?.contact;

  return (
    <MainLayout>
      <SEO
        title={seoData?.title || 'Contact Solvia – Get Help with Your Medical Career'}
        description={seoData?.description || 'Have questions about medical license recognition or job opportunities? Contact our team.'}
        path="/contact"
      />
      <div className="container max-w-2xl mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{t.contact.title}</h1>
          <p className="text-muted-foreground">
            {t.contact.subtitle}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.contact.fullName} *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.contact.email} *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.contact.mobile}</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 234 567 8900" {...field} />
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
                  <FormLabel>{t.contact.country} *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.contact.message} *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please provide details about your inquiry..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              <Send className="mr-2 h-4 w-4" />
              {t.contact.submit}
            </Button>
          </form>
        </Form>
      </div>
    </MainLayout>
  );
};

export default Contact;
