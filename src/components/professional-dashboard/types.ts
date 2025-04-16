
import { ProfileFormValues } from '@/components/professional-profile/types';

export interface DashboardState {
  searchQuery: string;
  currentPage: number;
  selectedJobTypes: string[];
  selectedCountry: string;
  selectedCity: string;
  activeFilters: string[];
  savedVacancies: string[];
  appliedVacancies: string[];
  profileData: ProfileFormValues;
  savedTabView: 'saved' | 'applied';
}

export interface ProfessionalCardInterface {
  id: string;
  name: string;
  title: string;
  location: string;
  specialty: string;
  languages: string[];
  experience: number;
}

export interface InstitutionCardInterface {
  id: string;
  name: string;
  type: string;
  location: string;
  openPositions: number;
}
