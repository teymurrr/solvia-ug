
export interface Professional {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  country: string;
  languages: { language: string; level: string }[];
  experience: number;
  fspCertificate: boolean;
  activelySearching: boolean;
  experiences: {
    hospital: string;
    role: string;
    startDate: string;
    current?: boolean;
  }[];
  education: {
    institution: string;
    degree: string;
    field: string;
  }[];
}

export interface Institution {
  id: string;
  name: string;
  type: string;
  location: string;
  openPositions: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
}
