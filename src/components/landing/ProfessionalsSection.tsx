
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Users, ArrowRight, MapPin, Languages, Clock, GraduationCap, Award, Building, Search } from 'lucide-react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Professional } from '@/types/landing';

interface ProfessionalsSectionProps {
  professionals: Professional[];
}

const ProfessionalCard: React.FC<{ professional: Professional }> = ({ professional }) => {
  const { firstName, lastName, specialty, country, languages, experience, fspCertificate, activelySearching, experiences, education, profileImage } = professional;
  const fullName = `${firstName} ${lastName}`;
  const latestExperience = experiences?.[0];
  const latestEducation = education?.[0];

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Profile image */}
          <div className="h-16 w-16 rounded-full overflow-hidden bg-medical-100 flex items-center justify-center flex-shrink-0">
            {profileImage ? (
              <img src={profileImage} alt={fullName} className="h-full w-full object-cover" />
            ) : (
              <div className="text-2xl font-bold text-medical-500">{firstName.charAt(0)}</div>
            )}
          </div>
          
          {/* Name and title */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{fullName}</h3>
              {fspCertificate && (
                <Award className="h-5 w-5 text-yellow-500" aria-label="FSP Certified" />
              )}
              {activelySearching && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 flex items-center gap-1">
                  <Search className="h-3 w-3" />
                  <span>Active</span>
                </Badge>
              )}
            </div>
            <p className="text-sm text-medical-600">{specialty}</p>
          </div>
        </div>
        
        <div className="mt-4 space-y-3">
          {/* Location */}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{country}</span>
          </div>
          
          {/* Languages */}
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              {languages.map((lang, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {lang.language} ({lang.level})
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Experience */}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{experience} {experience === 1 ? 'year' : 'years'} experience</span>
          </div>
          
          {/* Current role */}
          {latestExperience && (
            <div className="flex items-center gap-2 text-sm">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span>{latestExperience.role} at {latestExperience.hospital}</span>
            </div>
          )}
          
          {/* Education */}
          {latestEducation && (
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <span>{latestEducation.degree} in {latestEducation.field}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-end gap-2 border-t mt-4">
        <Button variant="outline" asChild>
          <Link to={`/professionals/${professional.id}`}>View Profile</Link>
        </Button>
        <Button asChild>
          <Link to={`/messages/new?professional=${professional.id}`}>Contact</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const ProfessionalsSection: React.FC<ProfessionalsSectionProps> = ({ professionals }) => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Users className="h-12 w-12 text-primary mx-auto mb-4" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1" />
            <h2 className="text-3xl font-bold">Professionals</h2>
            <div className="flex-1 flex justify-end">
              <Button variant="ghost" asChild className="group">
                <Link to="/professionals" className="flex items-center">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
          <p className="text-lg text-muted-foreground">
            Connect with talented healthcare professionals ready for their next opportunity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {professionals.slice(0, 4).map((professional) => (
            <ProfessionalCard
              key={professional.id}
              professional={professional}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfessionalsSection;
