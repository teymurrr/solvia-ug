
export interface VacancyCardProps {
  id: string;
  title: string;
  institution: string;
  location: string;
  jobType: string;
  // Make specialty optional since it's treated as optional in ProfessionalDashboard.tsx
  specialty?: string;
  profession?: string;
  department?: string;
  salary?: string;
  benefits?: string[];
  createdAt?: string;
  expiresAt?: string;
  applicationCount?: number;
  description?: string;
  requirements?: string[];
  status?: 'active' | 'draft' | 'expired' | 'closed';
  isDashboardCard?: boolean;
  isSaved?: boolean;
  isApplied?: boolean;
  className?: string;
  showSaveOption?: boolean;
  onSaveToggle?: (id: string) => void;
  isLandingPageCard?: boolean;
  fromLandingPage?: boolean;
  showDescription?: boolean;
  showRequirements?: boolean;
  // Adding the missing props that were causing errors
  searchQuery?: string;
  currentPage?: number;
  selectedFilters?: {
    jobTypes: string[];
    country: string;
    city: string;
  };
}
