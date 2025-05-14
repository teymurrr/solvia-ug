
export interface DashboardTranslations {
  title?: string;
  subtitle?: string;
  hero: {
    title: string;
    subtitle: string;
    findJob: string;
    findTalent: string;
    rotatingPhrases: string[];
  };
  vacancies: {
    title: string;
    subtitle: string;
    viewAll: string;
    viewMore: string;
    posted: string;
    ago: string;
    hours?: string;
    days?: string;
    noVacancies?: string;
    positions: string;
    location: string;
    institution: string;
  };
  professionals: {
    title: string;
    subtitle: string;
    viewAll: string;
    noProfessionals?: string;
    profession: string;
    specialty: string;
    location: string;
  };
  blog?: {
    title: string;
    subtitle: string;
    viewAll: string;
    readMore: string;
    noPosts: string;
  };
  contact: {
    title: string;
    subtitle: string;
    contactUs: string;
  };
  applications: {
    pending: string;
    reviewing: string;
    accepted: string;
    rejected: string;
    viewDetails: string;
    applicationDetails: string;
    reviewApplication: string;
    noEmailProvided: string;
    appliedFor: string;
    coverLetter: string;
    markPending: string;
    startReview: string;
    reject: string;
    accept: string;
    markAsPending: string;
    updateStatus: string;
    appliedOn: string;
    unknown: string;
  };
  profile?: {
    title: string;
    description: string;
    createProfile: string;
    completeProfile: string;
    updateProfile: string;
    loading: string;
    editProfile: string;
    saveProfile: string;
    activelySearching: string;
    openToRelocation: string;
    fspCertified: string;
    profileCompletion: string;
    location: string;
    notSpecified: string;
    profession: string;
    fspCertificate: string;
    yes: string;
    no: string;
    experience: string;
    at: string;
    present: string;
    education: string;
    in: string;
    languages: string;
    about: string;
    incompleteProfile: string;
  };
  saved?: {
    title: string;
    description: string;
    savedVacancies: string;
    appliedVacancies: string;
    noSaved: string;
    noSavedDesc: string;
    noApplied: string;
    noAppliedDesc: string;
    browseVacancies: string;
    vacancyRemoved: string;
    vacancyRemovedDesc: string;
  };
}
