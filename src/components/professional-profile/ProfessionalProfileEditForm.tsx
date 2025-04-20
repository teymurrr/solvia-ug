
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useProfileData } from './hooks/useProfileData';

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
    profession: "Doctor",
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
  const [isLoading, setIsLoading] = useState(true);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialData,
    mode: "onChange"
  });

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      
      // Only attempt to load data if the dialog is open
      loadProfileData().then(data => {
        if (data) {
          const typedData: ProfileFormValues = {
            ...data,
            experiences: Array.isArray(data.experiences) ? data.experiences as Experience[] : [],
            education: Array.isArray(data.education) ? data.education as Education[] : [],
            languages: Array.isArray(data.languages) ? data.languages as Language[] : [],
          };
          form.reset(typedData);
          
          // Update image previews
          setImagePreview(typedData.profileImage || null);
          setSfpCertificatePreview(typedData.fspCertificateFile || null);
        } else {
          console.log("Using fallback data for form");
          form.reset(initialData);
        }
        setIsLoading(false);
      }).catch(error => {
        console.error("Error loading profile data:", error);
        form.reset(initialData);
        toast({
          title: "Could not load profile data",
          description: "Using default values. You can still edit and save your profile.",
          variant: "destructive",
        });
        setIsLoading(false);
      });
    }
  }, [open, form, loadProfileData, initialData, toast]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const success = await saveProfileData(data);
      if (success && onSave) {
        onSave(data);
      }
      if (success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const [imagePreview, setImagePreview] = useState<string | null>(initialData.profileImage || null);
  const [sfpCertificatePreview, setSfpCertificatePreview] = useState<string | null>(
    initialData.fspCertificateFile || null
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

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Loading Profile...</DialogTitle>
            <DialogDescription>
              Please wait while we load your profile information.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
                {loading ? (
                  <>
                    <span className="mr-2 inline-block animate-spin">⟳</span>
                    Saving...
                  </>
                ) : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfessionalProfileEditForm;
