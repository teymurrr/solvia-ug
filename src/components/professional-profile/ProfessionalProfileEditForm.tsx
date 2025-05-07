
import React, { useEffect } from 'react';
import { ProfileFormValues } from './types';
import { ProfileFormDialog } from './ProfileFormDialog';
import { useProfileData } from './hooks/useProfileData';

interface ProfessionalProfileEditFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<ProfileFormValues>;
  onSave?: (data: ProfileFormValues) => void;
}

const ProfessionalProfileEditForm: React.FC<ProfessionalProfileEditFormProps> = ({ 
  open, 
  onOpenChange, 
  initialData, 
  onSave 
}) => {
  const { refreshProfileData } = useProfileData();
  
  // Always refresh profile data when the dialog opens
  useEffect(() => {
    if (open) {
      refreshProfileData();
    }
  }, [open, refreshProfileData]);
  
  return <ProfileFormDialog 
    open={open} 
    onOpenChange={onOpenChange} 
    initialData={initialData}
    onSave={onSave}
  />;
};

export default ProfessionalProfileEditForm;
