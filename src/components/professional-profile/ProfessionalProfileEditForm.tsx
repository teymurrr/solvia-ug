
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useProfileData } from './hooks/useProfileData';

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

const defaultProfileData: Partial<ProfileFormValues> = {
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
  fspCertificate: false,
  fspCertificateFile: "",
};

const ProfessionalProfileEditForm: React.FC<ProfessionalProfileEditFormProps> = ({
  open,
  onOpenChange,
  initialData = defaultProfileData,
  onSave
}) => {
  const { toast } = useToast();
  const { saveProfileData, loadProfileData, loading: profileLoading } = useProfileData();
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [sfpCertificatePreview, setSfpCertificatePreview] = useState<string | null>(null);
  
  // Initialize form with default values
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialData,
    mode: "onChange"
  });

  // Only load profile data when the dialog is opened and data hasn't been loaded yet
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (open && !dataLoaded) {
        console.log("Fetching profile data...");
        setLoading(true);
        
        try {
          const data = await loadProfileData();
          
          if (!isMounted) return;
          
          if (data) {
            console.log("Setting form data from loaded profile");
            form.reset(data);
            
            // Set preview images based on loaded data
            setImagePreview(data.profileImage || null);
            setSfpCertificatePreview(data.fspCertificateFile || null);
          } else {
            console.log("No profile data found, using defaults");
            form.reset(initialData);
          }
          
          setDataLoaded(true);
        } catch (error) {
          console.error("Error loading profile data:", error);
          if (isMounted) {
            toast({
              title: "Could not load profile data",
              description: "Using default values. You can still edit and save your profile.",
              variant: "destructive",
            });
            form.reset(initialData);
          }
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [open, dataLoaded, form, initialData, loadProfileData, toast]);

  // Reset the dataLoaded state when the dialog is closed
  useEffect(() => {
    if (!open) {
      setDataLoaded(false);
    }
  }, [open]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const success = await saveProfileData(data);
      if (success && onSave) {
        onSave(data);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    }
  };

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

  // Set up loading state
  const isLoading = loading || profileLoading;

  console.log("Dialog open state:", open);
  console.log("Loading state:", isLoading);

  return (
    <Dialog open={open} onOpenChange={(newOpenState) => {
      console.log("Dialog onOpenChange called with:", newOpenState);
      onOpenChange(newOpenState);
    }}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <>
            <DialogHeader>
              <DialogTitle>Loading Profile...</DialogTitle>
              <DialogDescription>
                Please wait while we load your profile information.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProfessionalProfileEditForm;
