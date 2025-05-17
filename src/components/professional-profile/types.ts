
import { z } from 'zod';

// Define the experience schema
export const experienceSchema = z.object({
  hospital: z.string().min(1, "Hospital/Institution name is required."),
  location: z.string().min(1, "Location is required."),
  role: z.string().min(1, "Role is required."),
  startDate: z.string().min(1, "Start date is required."),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
});

// Define the education schema
export const educationSchema = z.object({
  institution: z.string().min(1, "Institution name is required."),
  degree: z.string().min(1, "Degree is required."),
  field: z.string().min(1, "Field of study is required."),
  startDate: z.string().min(1, "Start date is required."),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
});

// Define the language schema
export const languageSchema = z.object({
  language: z.string().min(1, "Language is required."),
  level: z.string().min(1, "Level is required."),
  certificate: z.string().optional(),
});

// Define the form schema with arrays for experience, education, and languages
export const profileFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  profession: z.string().min(1, "Profession is required."),
  specialty: z.string().min(2, "Specialty is required."),
  email: z.string().email("Please enter a valid email."),
  location: z.string().optional(),
  phone: z.string().optional(), // Added phone field
  about: z.string().optional(),
  profileImage: z.string().optional(),
  activelySearching: z.boolean().optional(),
  openToRelocation: z.boolean().optional(),
  experiences: z.array(experienceSchema),
  education: z.array(educationSchema),
  languages: z.array(languageSchema),
  fspCertificate: z.boolean().optional(),
  fspCertificateFile: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export interface Experience {
  hospital: string;
  location: string;
  role: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
}

export interface Language {
  language: string;
  level: string;
  certificate?: string;
}
