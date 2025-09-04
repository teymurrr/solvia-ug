
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';

const OpenPositionsSection = () => {
  const { t } = useLanguage();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const getPositions = () => {
    if (t?.forDoctors?.positions?.items) {
      return t.forDoctors.positions.items;
    }
    
    // Fallback to English
    return [
      {
        id: 1,
        title: "Cardiologist",
        hospital: "University Hospital Munich",
        location: "Munich, Bavaria",
        type: "Full-time",
        posted: "2 days ago",
        salary: "€75,000 - €95,000"
      },
      {
        id: 2,
        title: "Emergency Medicine Physician",
        hospital: "Charité Berlin",
        location: "Berlin",
        type: "Full-time",
        posted: "1 week ago",
        salary: "€70,000 - €90,000"
      },
      {
        id: 3,
        title: "Pediatrician",
        hospital: "Hamburg Medical Center",
        location: "Hamburg",
        type: "Full-time",
        posted: "3 days ago",
        salary: "€68,000 - €85,000"
      },
      {
        id: 4,
        title: "Anesthesiologist",
        hospital: "Frankfurt General Hospital",
        location: "Frankfurt, Hesse",
        type: "Full-time",
        posted: "5 days ago",
        salary: "€80,000 - €100,000"
      }
    ];
  };

  const positions = getPositions();

  const handleViewDetails = (positionId: number) => {
    if (!isLoggedIn) {
      navigate('/signup/professional');
    } else {
      // Navigate to vacancy details if logged in
      navigate(`/vacancies/${positionId}`);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t?.forDoctors?.positions?.title || "Open Positions"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t?.forDoctors?.positions?.subtitle || "Discover exciting opportunities at leading healthcare institutions across Germany"}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {positions.map((position: any, index: number) => (
              <Card key={position.id || index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl">{position.title}</CardTitle>
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {position.posted}
                    </span>
                  </div>
                  <CardDescription className="font-medium text-primary">
                    {position.hospital}
                  </CardDescription>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {position.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{position.type}</span>
                      <span className="font-semibold text-primary">{position.salary}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleViewDetails(position.id || index + 1)}
                  >
                    {t?.forDoctors?.positions?.viewDetails || "View Details"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button variant="outline" asChild className="group border-primary text-primary hover:bg-primary/10">
              <Link to="/signup/professional" className="flex items-center">
                {t?.forDoctors?.positions?.viewAll || "View All Positions"}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OpenPositionsSection;
