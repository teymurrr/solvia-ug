
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterDropdownsProps {
  filters: {
    role: string;
    profession: string;
    country: string;
    language: string;
  };
  onFilterChange: (filterName: string, value: string) => void;
  disabled?: boolean;
}

const FilterDropdowns: React.FC<FilterDropdownsProps> = ({
  filters,
  onFilterChange,
  disabled = false
}) => {
  // Add predefined filter options
  const roleOptions = [
    { value: 'all_roles', label: 'All roles' },
    { value: 'Doctor', label: 'Doctor' },
    { value: 'Nurse', label: 'Nurse' },
    { value: 'Specialist', label: 'Specialist' },
    { value: 'Therapist', label: 'Therapist' },
    { value: 'Surgeon', label: 'Surgeon' },
  ];
  
  const professionOptions = [
    { value: 'all_professions', label: 'All professions' },
    { value: 'Cardiology', label: 'Cardiology' },
    { value: 'Neurology', label: 'Neurology' },
    { value: 'Pediatrics', label: 'Pediatrics' },
    { value: 'Emergency', label: 'Emergency Care' },
    { value: 'Family', label: 'Family Medicine' },
    { value: 'Orthopedics', label: 'Orthopedics' },
  ];
  
  const countryOptions = [
    { value: 'all_countries', label: 'All countries' },
    { value: 'Germany', label: 'Germany' },
    { value: 'Spain', label: 'Spain' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Sweden', label: 'Sweden' },
    { value: 'France', label: 'France' },
    { value: 'Italy', label: 'Italy' },
  ];
  
  const languageOptions = [
    { value: 'all_languages', label: 'All languages' },
    { value: 'English', label: 'English' },
    { value: 'German', label: 'German' },
    { value: 'Spanish', label: 'Spanish' },
    { value: 'French', label: 'French' },
    { value: 'Italian', label: 'Italian' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <Select
          value={filters.role}
          onValueChange={(value) => onFilterChange('role', value)}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Select
          value={filters.profession}
          onValueChange={(value) => onFilterChange('profession', value)}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Profession" />
          </SelectTrigger>
          <SelectContent>
            {professionOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Select
          value={filters.country}
          onValueChange={(value) => onFilterChange('country', value)}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            {countryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Select
          value={filters.language}
          onValueChange={(value) => onFilterChange('language', value)}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            {languageOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterDropdowns;
