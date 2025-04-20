
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

interface ProfileFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<ProfileFormValues>;
  onSave?: (data: ProfileFormValues) => void;
}

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
            
            <PersonalInfoSection form={form} />
            
            <ExperienceSection form={form} />
            
            <EducationSection form={form} />
            
            <LanguageSection 
              form={form} 
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
