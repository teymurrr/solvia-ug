import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  MapPin, 
  Mail, 
  Languages, 
  GraduationCap, 
  Briefcase, 
  Award,
  ArrowLeft,
  MessageSquare
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';
import { useProtectedAction } from '@/hooks/useProtectedAction';

const ProfessionalProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { handleProtectedAction } = useProtectedAction();

  const { data: professional, isLoading, error } = useQuery({
    queryKey: ['professional', id],
    queryFn: async () => {
      if (!id) throw new Error('No professional ID provided');

      // Fetch main profile
      const { data: profile, error: profileError } = await supabase
        .from('professional_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (profileError) throw profileError;

      // Fetch related data in parallel
      const [experiencesResult, educationResult, languagesResult] = await Promise.all([
        supabase
          .from('experiences')
          .select('*')
          .eq('profile_id', id)
          .order('start_date', { ascending: false }),
        supabase
          .from('education')
          .select('*')
          .eq('profile_id', id)
          .order('start_date', { ascending: false }),
        supabase
          .from('languages')
          .select('*')
          .eq('profile_id', id)
      ]);

      return {
        id: profile.id,
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: profile.email || '',
        specialty: profile.specialty || '',
        profession: profile.profession || '',
        location: profile.location || '',
        about: profile.about || '',
        profileImage: profile.profile_image || '',
        activelySearching: profile.actively_searching || false,
        fspCertificate: profile.fsp_certificate || false,
        openToRelocation: profile.open_to_relocation || false,
        experiences: experiencesResult.data || [],
        education: educationResult.data || [],
        languages: languagesResult.data || []
      };
    },
    enabled: !!id
  });

  const handleContact = () => {
    handleProtectedAction(() => navigate(`/messages/new?professional=${id}`));
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-6" />
          <Card>
            <CardContent className="p-8">
              <div className="flex gap-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (error || !professional) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Professional not found</h2>
              <p className="text-muted-foreground mb-4">
                The professional profile you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate('/professionals')}>
                View All Professionals
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const fullName = `${professional.firstName} ${professional.lastName}`.trim();
  const totalExperience = professional.experiences.reduce((total, exp) => {
    const start = exp.start_date ? new Date(exp.start_date) : null;
    const end = exp.current ? new Date() : (exp.end_date ? new Date(exp.end_date) : null);
    if (start && end) {
      return total + (end.getFullYear() - start.getFullYear());
    }
    return total;
  }, 0);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center flex-shrink-0">
                {professional.profileImage ? (
                  <img 
                    src={professional.profileImage} 
                    alt={fullName} 
                    className="h-full w-full object-cover" 
                  />
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    {professional.firstName.charAt(0)}{professional.lastName.charAt(0)}
                  </span>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold">{fullName}</h1>
                    <p className="text-muted-foreground">
                      {professional.profession || professional.specialty}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                      {professional.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span>{professional.location}</span>
                        </div>
                      )}
                      {professional.email && (
                        <div className="flex items-center gap-1">
                          <Mail size={16} />
                          <span>{professional.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {professional.specialty && (
                        <Badge variant="secondary">{professional.specialty}</Badge>
                      )}
                      {professional.activelySearching && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          Actively Searching
                        </Badge>
                      )}
                      {professional.openToRelocation && (
                        <Badge variant="outline">Open to Relocation</Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button onClick={handleContact} className="flex-shrink-0">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        {professional.about && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-3">About</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{professional.about}</p>
            </CardContent>
          </Card>
        )}

        {/* Experience Section */}
        {professional.experiences.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Experience</h2>
                {totalExperience > 0 && (
                  <Badge variant="outline">{totalExperience}+ years</Badge>
                )}
              </div>
              <div className="space-y-4">
                {professional.experiences.map((exp, index) => (
                  <div key={exp.id || index} className="border-l-2 border-primary/20 pl-4">
                    <h3 className="font-medium">{exp.role}</h3>
                    <p className="text-sm text-muted-foreground">{exp.hospital}</p>
                    {exp.location && (
                      <p className="text-sm text-muted-foreground">{exp.location}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Education Section */}
        {professional.education.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Education</h2>
              </div>
              <div className="space-y-4">
                {professional.education.map((edu, index) => (
                  <div key={edu.id || index} className="border-l-2 border-primary/20 pl-4">
                    <h3 className="font-medium">{edu.degree} in {edu.field}</h3>
                    <p className="text-sm text-muted-foreground">{edu.institution}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {edu.start_date} - {edu.current ? 'Present' : edu.end_date}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Languages Section */}
        {professional.languages.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Languages className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Languages</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {professional.languages.map((lang, index) => (
                  <Badge key={lang.id || index} variant="secondary">
                    {lang.language} {lang.level && `(${lang.level})`}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Certificates Section */}
        {professional.fspCertificate && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Certificates</h2>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">
                  ✓ FSP Certificate
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default ProfessionalProfile;
