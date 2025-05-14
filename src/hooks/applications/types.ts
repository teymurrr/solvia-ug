
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
}

export type ApplicationStatus = 
  | 'pending'
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
