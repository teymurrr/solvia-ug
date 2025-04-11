
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';

import { ProfileFormValues, profileFormSchema } from './types';
import ProfileImageSection from './ProfileImageSection';
import PersonalInfoSection from './PersonalInfoSection';
import ExperienceSection from './ExperienceSection';
import EducationSection from './EducationSection';
import LanguageSection from './LanguageSection';
import CertificatesSection from './CertificatesSection';

interface ProfessionalProfileEditFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<ProfileFormValues>;
  onSave?: (data: ProfileFormValues) => void;
}

const languageLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
const professionOptions = ["Doctor", "Nurse", "Specialist", "Technician", "Therapist", "Other"];

const ProfessionalProfileEditForm: React.FC<ProfessionalProfileEditFormProps> = ({
  open,
  onOpenChange,
  initialData = {
    firstName: "John",
    lastName: "Doe",
    profession: "Doctor",
    specialty: "Cardiologist",
    email: "john.doe@example.com",
    location: "",
    about: "",
    profileImage: "",
    activelySearching: false,
    openToRelocation: false,
    experiences: [{ hospital: "", location: "", role: "", startDate: "", endDate: "", current: false }],
    education: [{ institution: "", degree: "", field: "", startDate: "", endDate: "", current: false }],
    languages: [{ language: "", level: "A1", certificate: "" }],
    sfpCertificate: false,
    sfpCertificateFile: "",
  },
  onSave
}) => {
  const { toast } = useToast();
  const [savedData, setSavedData] = useState<ProfileFormValues | null>(null);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: savedData || initialData,
  });

  const onSubmit = (data: ProfileFormValues) => {
    // In a real application, this would save to a database
    console.log("Profile data to save:", data);
    
    // Save data in local state (simulate persistence between modal opens)
    setSavedData(data);
    
    // Pass the data to the parent component
    if (onSave) {
      onSave(data);
    }
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
    
    onOpenChange(false);
  };

  const [imagePreview, setImagePreview] = useState<string | null>(initialData.profileImage || null);
  const [sfpCertificatePreview, setSfpCertificatePreview] = useState<string | null>(
    initialData.sfpCertificateFile || null
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue("profileImage", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSfpCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSfpCertificatePreview(result);
        form.setValue("sfpCertificateFile", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLanguageCertificateChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const currentLanguages = form.getValues("languages");
        currentLanguages[index].certificate = result;
        form.setValue("languages", currentLanguages);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Your Profile</DialogTitle>
          <DialogDescription>
            Update your profile information to help institutions find you.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ProfileImageSection 
              imagePreview={imagePreview} 
              handleImageChange={handleImageChange} 
            />
            
            <PersonalInfoSection 
              form={form} 
              professionOptions={professionOptions} 
            />
            
            <ExperienceSection form={form} />
            
            <EducationSection form={form} />
            
            <LanguageSection 
              form={form} 
              languageLevels={languageLevels} 
              handleLanguageCertificateChange={handleLanguageCertificateChange} 
            />
            
            <CertificatesSection 
              form={form} 
              sfpCertificatePreview={sfpCertificatePreview}
              handleSfpCertificateChange={handleSfpCertificateChange}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfessionalProfileEditForm;
