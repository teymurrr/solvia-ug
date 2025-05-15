
export type ApplicationStatus = 'pending' | 'reviewing' | 'interview' | 'offered' | 'rejected' | 'accepted' | 'withdrawn';

export interface Application {
  id: string;
  vacancy_id: string;
  user_id: string;
  application_date: string;
  status: ApplicationStatus;
  application_data: any;
  vacancy?: {
    title: string;
    institution: string;
    location: string;
  };
  professional?: {
    first_name: string;
    last_name: string;
    specialty?: string;
    profile_image?: string;
    phone?: string;  // Added phone property
  };
  // Additional properties used in ApplicationCard
  applicantName?: string;
  applicantEmail?: string;
  applicantPhone?: string;
  applicantPhoto?: string;
  vacancyTitle?: string;
  appliedDate?: string;
  coverLetter?: string;
  cvFileName?: string;
}

export interface ApplicationFilter {
  status: string;
  date?: string; // Make date optional to match usage
}

export interface ApplicationFilters {
  status: string;
  date?: string;
}
