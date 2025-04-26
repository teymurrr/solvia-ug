
export const formatDate = (dateString?: string) => {
  if (!dateString) return "Date not specified";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }).format(date);
};

export const calculateDaysRemaining = (applicationDeadline?: string) => {
  if (!applicationDeadline) return null;
  const today = new Date();
  const deadline = new Date(applicationDeadline);
  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getJobTypeBadgeVariant = (type: string) => {
  switch(type) {
    case 'Full-time':
      return 'default';
    case 'Part-time':
      return 'secondary';
    case 'Internship':
      return 'outline';
    case 'Volunteer':
      return 'destructive';
    default:
      return 'default';
  }
};
