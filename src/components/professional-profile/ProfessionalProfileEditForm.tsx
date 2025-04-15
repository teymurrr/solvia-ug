
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useProfileData } from './useProfileData';

import { ProfileFormValues, profileFormSchema, Experience, Education, Language } from './types';
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
    firstName: "",
    lastName: "",
    profession: "",
    specialty: "",
    email: "",
    location: "",
    about: "",
    profileImage: "",
    activelySearching: false,
    openToRelocation: false,
    experiences: [{ hospital: "", location: "", role: "", startDate: "", endDate: "", current: false }],
    education: [{ institution: "", degree: "", field: "", startDate: "", endDate: "", current: false }],
    languages: [{ language: "", level: "A1", certificate: "" }],
    fspCertificate: false,
    fspCertificateFile: "",
  },
  onSave
}) => {
  const { toast } = useToast();
  const { saveProfileData, loadProfileData, loading } = useProfileData();
  const [savedData, setSavedData] = useState<ProfileFormValues | null>(null);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: savedData || initialData,
  });

  useEffect(() => {
    if (open) {
      // Reset the form when dialog opens
      console.log("Loading profile data for edit form");
      loadProfileData().then(data => {
        if (data) {
          console.log("Retrieved profile data for form:", data);
          // Ensure the loaded data has the correct types for the arrays
          const typedData: ProfileFormValues = {
            ...data,
            experiences: data.experiences as Experience[] || [],
            education: data.education as Education[] || [],
            languages: data.languages as Language[] || [],
          };
          form.reset(typedData);
          setSavedData(typedData);
        } else {
          console.log("No profile data found, using initial data");
          form.reset(initialData);
        }
      }).catch(error => {
        console.error("Error loading profile data:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile data. Please try again.",
          variant: "destructive",
        });
        form.reset(initialData);
      });
    }
  }, [open, form, loadProfileData, initialData, toast]);

  const onSubmit = async (data: ProfileFormValues) => {
    console.log("Submitting profile data:", data);
    try {
      await saveProfileData(data);
      if (onSave) {
        onSave(data);
      }
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving profile data:", error);
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const [imagePreview, setImagePreview] = useState<string | null>(initialData.profileImage || null);
  const [sfpCertificatePreview, setSfpCertificatePreview] = useState<string | null>(
    initialData.fspCertificateFile || null
  );

  useEffect(() => {
    // Update previews when form data changes
    const formValues = form.getValues();
    setImagePreview(formValues.profileImage || null);
    setSfpCertificatePreview(formValues.fspCertificateFile || null);
  }, [form, savedData]);

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
        form.setValue("fspCertificateFile", result);
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
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfessionalProfileEditForm;
