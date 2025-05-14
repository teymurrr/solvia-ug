
export interface Application {
  id: string;
  user_id: string;
  vacancy_id: string;
  application_date: string;
  status: ApplicationStatus;
  application_data?: ApplicationData;
  vacancy?: {
    title: string;
    institution: string;
    department: string;
    location: string;
    description: string;
    requirements: string[] | null;
    job_type: string;
  };
  user?: {
    email: string;
    firstName?: string;
    lastName?: string;
    profession?: string;
    specialty?: string;
  };
  // Computed properties for UI display
  applicantId?: string;
  applicantName?: string;
  applicantPhoto?: string;
  applicantEmail?: string;
  applicantPhone?: string;
  vacancyId?: string;
  vacancyTitle?: string;
  appliedDate?: string;
  coverLetter?: string;
  cvFileName?: string;
}

export type ApplicationStatus = 
  | 'pending'
  | 'reviewing'  // Add 'reviewing' as a valid status
  | 'reviewed'
  | 'shortlisted'
  | 'interview'
  | 'accepted'
  | 'rejected';

export interface ApplicationData {
  cover_letter?: string;
  resume_url?: string;
  questions?: {
    question: string;
    answer: string;
  }[];
  [key: string]: any;
}

export interface ApplicationFilter {
  status: ApplicationStatus | 'all';
  searchQuery: string;
}

// Add ApplicationFilters interface for useApplicationFilters hook
export interface ApplicationFilters {
  status: ApplicationStatus | 'all';
  dateRange: 'all' | 'today' | 'this_week' | 'this_month';
}
