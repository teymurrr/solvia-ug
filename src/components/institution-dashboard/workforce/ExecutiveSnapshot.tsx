import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, AlertTriangle, TrendingDown, Activity } from 'lucide-react';
import { KPIData } from './types';

interface ExecutiveSnapshotProps {
  data: KPIData;
}

const ExecutiveSnapshot: React.FC<ExecutiveSnapshotProps> = ({ data }) => {
  const fteProgress = (data.totalFTE / data.plannedFTE) * 100;
  const fteGap = data.plannedFTE - data.totalFTE;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* FTE Card */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Users className="h-4 w-4" />
            Total FTE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalFTE.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            of {data.plannedFTE.toLocaleString()} planned
            <span className={fteGap > 0 ? 'text-amber-600 ml-1' : 'text-green-600 ml-1'}>
              ({fteGap > 0 ? `-${fteGap}` : `+${Math.abs(fteGap)}`})
            </span>
          </p>
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${Math.min(fteProgress, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Staffing Coverage */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Staffing Coverage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.staffingCoverage}%</div>
          <p className="text-xs text-muted-foreground">Hospital-wide</p>
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                data.staffingCoverage >= 95 ? 'bg-green-500' : 
                data.staffingCoverage >= 85 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${data.staffingCoverage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Open Positions Critical */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Critical Openings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{data.openPositionsCritical}</div>
          <p className="text-xs text-muted-foreground">Positions requiring urgent fill</p>
        </CardContent>
      </Card>

      {/* Sick Leave Rate */}
      <Card className="border-l-4 border-l-amber-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Sick Leave Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.sickLeaveRate}%</div>
          <p className="text-xs text-muted-foreground">Rolling 30 days</p>
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                data.sickLeaveRate <= 5 ? 'bg-green-500' : 
                data.sickLeaveRate <= 8 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(data.sickLeaveRate * 5, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveSnapshot;
