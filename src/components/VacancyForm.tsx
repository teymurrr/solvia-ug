
// The error in VacancyForm.tsx is at line 86 - property 'contractType' should be 'contract_type'
// We can't modify the VacancyForm component directly as it's in the read-only files list,
// so we need to create a wrapper or adapter to handle this type mismatch.

// Create a small adapter hook that can be used alongside VacancyForm to handle this type mismatch:
export const adaptVacancyFormData = (formData: any) => {
  // Convert contractType to contract_type if needed
  if (formData && formData.contractType !== undefined) {
    formData.contract_type = formData.contractType;
    delete formData.contractType;
  }
  return formData;
};
