
import { z } from 'zod';

export const institutionSignupSchema = z.object({
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

export type InstitutionSignupFormValues = z.infer<typeof institutionSignupSchema>;
