
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ProfileFormValues } from './types';
import { useProfileEditForm } from './hooks/useProfileEditForm';
import ProfileImageSection from './ProfileImageSection';
import PersonalInfoSection from './PersonalInfoSection';
import ExperienceSection from './ExperienceSection';
import EducationSection from './EducationSection';
import LanguageSection from './LanguageSection';
import CertificatesSection from './CertificatesSection';
import WizardInfoSection from './WizardInfoSection';
import { useLanguage } from '@/hooks/useLanguage';

interface ProfileFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<ProfileFormValues>;
  onSave?: (data: ProfileFormValues) => void;
}

// Define the profession options and language levels that will be passed to child components
const professionOptions = ["Doctor", "Nurse", "Specialist", "Technician", "Therapist", "Other"];
const languageLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const ProfileFormDialog: React.FC<ProfileFormDialogProps> = ({
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
  const { t } = useLanguage();
  const {
    form,
    imagePreview,
    sfpCertificatePreview,
    handleImageChange,
    handleSfpCertificateChange,
    handleLanguageCertificateChange,
    onSubmit,
    loading
  } = useProfileEditForm(initialData, onOpenChange, onSave);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t?.dashboard?.profile?.editProfile || "Edit Your Profile"}</DialogTitle>
          <DialogDescription>
            {t?.dashboard?.profile?.description || "Update your profile information to help institutions find you."}
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
              handleLanguageCertificateChange={handleLanguageCertificateChange} 
              languageLevels={languageLevels}
            />
            
            <CertificatesSection 
              form={form} 
              sfpCertificatePreview={sfpCertificatePreview}
              handleSfpCertificateChange={handleSfpCertificateChange}
            />
            
            <WizardInfoSection form={form} />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t?.common?.cancel || "Cancel"}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="mr-2 inline-block animate-spin">⟳</span>
                    {t?.common?.saving || "Saving..."}
                  </>
                ) : t?.dashboard?.profile?.saveProfile || "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
