
import React from 'react';
import { Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterDropdownsProps {
  filters: {
    role: string;
    profession: string;
    country: string;
    language: string;
  };
  onFilterChange: (filterName: string, value: string) => void;
}

const FilterDropdowns: React.FC<FilterDropdownsProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-4">
      <div className="flex items-center">
        <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
        <span className="text-sm font-medium">Filters:</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full">
        <Select
          value={filters.role}
          onValueChange={(value) => onFilterChange('role', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Roles</SelectItem>
            <SelectItem value="doctor">Doctor</SelectItem>
            <SelectItem value="nurse">Nurse</SelectItem>
            <SelectItem value="specialist">Specialist</SelectItem>
            <SelectItem value="surgeon">Surgeon</SelectItem>
            <SelectItem value="technician">Technician</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.profession}
          onValueChange={(value) => onFilterChange('profession', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Profession" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Professions</SelectItem>
            <SelectItem value="cardiology">Cardiology</SelectItem>
            <SelectItem value="dermatology">Dermatology</SelectItem>
            <SelectItem value="neurology">Neurology</SelectItem>
            <SelectItem value="orthopedics">Orthopedics</SelectItem>
            <SelectItem value="pediatrics">Pediatrics</SelectItem>
            <SelectItem value="psychiatry">Psychiatry</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.country}
          onValueChange={(value) => onFilterChange('country', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Countries</SelectItem>
            <SelectItem value="canada">Canada</SelectItem>
            <SelectItem value="germany">Germany</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
            <SelectItem value="usa">United States</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.language}
          onValueChange={(value) => onFilterChange('language', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Languages</SelectItem>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="french">French</SelectItem>
            <SelectItem value="german">German</SelectItem>
            <SelectItem value="spanish">Spanish</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterDropdowns;
