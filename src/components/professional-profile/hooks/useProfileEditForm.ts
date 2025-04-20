
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
  const { saveProfileData, loading } = useProfileData();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: initialData,
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
