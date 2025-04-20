
import React from 'react';
import { ProfileFormValues } from './types';
import { ProfileFormDialog } from './ProfileFormDialog';

interface ProfessionalProfileEditFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<ProfileFormValues>;
  onSave?: (data: ProfileFormValues) => void;
}

const ProfessionalProfileEditForm: React.FC<ProfessionalProfileEditFormProps> = (props) => {
  return <ProfileFormDialog {...props} />;
};

export default ProfessionalProfileEditForm;
