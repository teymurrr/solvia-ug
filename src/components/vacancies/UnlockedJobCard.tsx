import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MapPin, Euro, Building, Clock, CheckCircle, ArrowRight, Bookmark } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UnlockedJobCardProps {
  id: string;
  title: string;
  hospital: string;
  city: string;
  country: string;
  department: string;
  salary?: string;
  requirements: string[];
  contractType: string;
  postedDate: string;
  onSave?: (id: string) => void;
  isSaved?: boolean;
}

const UnlockedJobCard = ({
  id,
  title,
  hospital,
  city,
  country,
  department,
  salary,
  requirements,
  contractType,
  postedDate,
  onSave,
  isSaved = false,
}: UnlockedJobCardProps) => {
  return (
    <Card className="p-5 border-border/50 hover:shadow-lg transition-all group">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="text-xs">
                {contractType}
              </Badge>
              <span className="text-xs text-muted-foreground">{postedDate}</span>
            </div>
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
              <Building className="h-4 w-4" />
              <span>{hospital}</span>
              <span>•</span>
              <span>{department}</span>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className={`flex-shrink-0 ${isSaved ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => onSave?.(id)}
          >
            <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Location & Salary */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{city}, {country}</span>
          </div>
          {salary && (
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Euro className="h-4 w-4" />
              <span>{salary}</span>
            </div>
          )}
        </div>

        {/* Requirements */}
        {requirements && requirements.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Requisitos:</p>
            <div className="flex flex-wrap gap-2">
              {requirements.slice(0, 4).map((req, index) => (
                <div key={index} className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  <CheckCircle className="h-3 w-3 text-primary" />
                  <span>{req}</span>
                </div>
              ))}
              {requirements.length > 4 && (
                <span className="text-xs text-muted-foreground">+{requirements.length - 4} más</span>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center gap-3 pt-3 border-t border-border/50">
          <Button asChild className="flex-1 group/btn">
            <Link to="/homologation-wizard" onClick={() => window.scrollTo(0, 0)}>
              Iniciar homologación para aplicar
              <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default UnlockedJobCard;
