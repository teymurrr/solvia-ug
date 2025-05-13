
// Define application-related type definitions

export interface Application {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantPhoto?: string;
  applicantEmail?: string;
  applicantPhone?: string;
  vacancyId: string;
  vacancyTitle: string;
  appliedDate: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  coverLetter?: string;
  cvFileName?: string;
}

export interface ApplicationData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  coverLetter?: string;
  cvFileName?: string;
  [key: string]: any; // Allow for additional fields
}

export interface ApplicationFilters {
  status: 'all_statuses' | 'pending' | 'reviewing' | 'accepted' | 'rejected';
  date: 'all_time' | 'today' | 'this_week' | 'this_month' | 'this_year';
}
