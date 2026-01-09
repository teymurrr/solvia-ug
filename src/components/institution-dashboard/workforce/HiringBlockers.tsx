import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, Users, FileCheck, Globe, CheckCircle2, Loader2 } from 'lucide-react';
import { HiringBlocker, InternationalHire } from './types';

interface HiringBlockersProps {
  blockers: HiringBlocker[];
  internationalHires: InternationalHire[];
}

const HiringBlockers: React.FC<HiringBlockersProps> = ({ blockers, internationalHires }) => {
  const getBlockerIcon = (type: string) => {
    switch (type) {
      case 'approval_delay': return <Clock className="h-4 w-4" />;
      case 'candidate_pipeline': return <Users className="h-4 w-4" />;
      case 'onboarding_admin': return <FileCheck className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getBlockerLabel = (type: string) => {
    switch (type) {
      case 'approval_delay': return 'Approval Delay';
      case 'candidate_pipeline': return 'Pipeline Issue';
      case 'onboarding_admin': return 'Onboarding Admin';
      default: return 'Other';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <Loader2 className="h-4 w-4 text-amber-500 animate-spin" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">Approved</Badge>;
      case 'in_progress': return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">In Progress</Badge>;
      default: return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Hiring & Onboarding Blockers
        </CardTitle>
        <CardDescription>Critical roles and bottlenecks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Top Blockers */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            Critical Open Roles
          </h4>
          {blockers.map((blocker) => (
            <div 
              key={blocker.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-background rounded-lg border">
                  {getBlockerIcon(blocker.blockerType)}
                </div>
                <div>
                  <p className="font-medium">{blocker.role}</p>
                  <p className="text-xs text-muted-foreground">
                    Open for {blocker.daysOpen} days
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {getBlockerLabel(blocker.blockerType)}
                </Badge>
                {blocker.isCritical && (
                  <Badge variant="destructive" className="text-xs">Critical</Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* International Hires Recognition Status */}
        {internationalHires.length > 0 && (
          <div className="pt-4 border-t space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              International Hires - Recognition Status
            </h4>
            <div className="grid gap-2">
              {internationalHires.map((hire) => (
                <div 
                  key={hire.id}
                  className="flex items-center justify-between p-2 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(hire.status)}
                    <div>
                      <p className="text-sm font-medium">{hire.name}</p>
                      <p className="text-xs text-muted-foreground">{hire.country}</p>
                    </div>
                  </div>
                  {getStatusBadge(hire.status)}
                </div>
              ))}
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground pt-2">
              <span>Pending: {internationalHires.filter(h => h.status === 'pending').length}</span>
              <span>In Progress: {internationalHires.filter(h => h.status === 'in_progress').length}</span>
              <span>Approved: {internationalHires.filter(h => h.status === 'approved').length}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HiringBlockers;
