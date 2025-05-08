// VacancyForm.tsx

import React, { useState } from 'react';

// Adapter function to handle the contractType to contract_type transformation
export const adaptVacancyFormData = (formData: any) => {
  // Convert contractType to contract_type if needed
  if (formData && formData.contractType !== undefined) {
    formData.contract_type = formData.contractType;
    delete formData.contractType;
  }
  return formData;
};

// VacancyForm component
const VacancyForm = ({ open, onOpenChange, onSubmit }: any) => {
  const [formData, setFormData] = useState({
    contractType: '',  // Initially use contractType
    // Other form fields
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const adaptedData = adaptVacancyFormData(formData);  // Use the adapter
    onSubmit(adaptedData);  // Submit adapted data
  };

  return (
    open ? (
      <div className="vacancy-form">
        <form onSubmit={handleSubmit}>
          {/* Form fields here */}
          <input
            type="text"
            value={formData.contractType}
            onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
            placeholder="Contract Type"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    ) : null
  );
};

export default VacancyForm;
