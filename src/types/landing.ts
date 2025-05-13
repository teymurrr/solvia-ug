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
  profileImage?: string;
}

export interface Institution {
  id: string;
  name: string;
  type: string;
  location: string;
  openPositions: number;
}

export interface BlogComment {
  id: string;
  blog_post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_name?: string;  // For display purposes
}

// Extend the existing BlogPost type to align with our database schema
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string | null;
  imageUrl?: string;
  date: string;
  category?: string;
  readTime?: string;
  author?: string;
  author_id?: string;
  status?: 'draft' | 'published';
}
