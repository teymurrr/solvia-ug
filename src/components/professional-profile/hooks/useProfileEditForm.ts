
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { ProfileFormValues, profileFormSchema } from '../types';
import { useProfileData } from './useProfileData';

export const useProfileEditForm = (
  initialData: Partial<ProfileFormValues>,
  onOpenChange: (open: boolean) => void,
  onSave?: (data: ProfileFormValues) => void,
) => {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(initialData.profileImage || null);
  const [sfpCertificatePreview, setSfpCertificatePreview] = useState<string | null>(
    initialData.fspCertificateFile || null
  );
  const [loading, setLoading] = useState(false);
  const { saveProfileData } = useProfileData();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      ...initialData,
      // Ensure arrays are initialized properly
      experiences: initialData.experiences || [{ hospital: "", location: "", role: "", startDate: "", endDate: "", current: false }],
      education: initialData.education || [{ institution: "", degree: "", field: "", startDate: "", endDate: "", current: false }],
      languages: initialData.languages || [{ language: "", level: "A1", certificate: "" }],
    },
  });

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

  const onSubmit = async (data: ProfileFormValues) => {
    setLoading(true);
    try {
      const result = await saveProfileData(data);
      
      // Fixed type check - check for result.success instead of comparing result to boolean
      if (result && result.success) {
        // Handle success case
        if (onSave) {
          onSave(data);
        }
        onOpenChange(false);
        toast({
          title: "Success",
          description: "Your profile has been updated successfully.",
        });
      } else {
        // Display error message
        toast({
          title: "Error",
          description: result?.error || "Failed to save profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    imagePreview,
    sfpCertificatePreview,
    handleImageChange,
    handleSfpCertificateChange,
    handleLanguageCertificateChange,
    onSubmit,
    loading
  };
};
