import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Clock, AlertCircle } from 'lucide-react';
import { DepartmentRisk } from './types';

interface RiskRadarProps {
  departments: DepartmentRisk[];
}

const RiskRadar: React.FC<RiskRadarProps> = ({ departments }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      default: return 'bg-green-500';
    }
  };

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-red-500" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-green-500" />;
      default: return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };

  // Sort by risk level
  const sortedDepartments = [...departments].sort((a, b) => {
    const order = { high: 0, medium: 1, stable: 2 };
    return order[a.riskLevel] - order[b.riskLevel];
  });

  const highRiskCount = departments.filter(d => d.riskLevel === 'high').length;
  const mediumRiskCount = departments.filter(d => d.riskLevel === 'medium').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Risk Radar
            </CardTitle>
            <CardDescription>Department staffing risk assessment</CardDescription>
          </div>
          <div className="flex gap-2">
            {highRiskCount > 0 && (
              <Badge variant="destructive">{highRiskCount} High Risk</Badge>
            )}
            {mediumRiskCount > 0 && (
              <Badge variant="secondary">{mediumRiskCount} Medium</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedDepartments.map((dept) => (
            <div 
              key={dept.id} 
              className={`flex items-center justify-between p-3 rounded-lg border ${
                dept.riskLevel === 'high' ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900' :
                dept.riskLevel === 'medium' ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900' :
                'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getRiskColor(dept.riskLevel)}`} />
                <div>
                  <p className="font-medium">{dept.name}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>Vacancy: {dept.vacancyRate}%</span>
                    <span className="flex items-center gap-1">
                      Sick leave {getTrendIcon(dept.sickLeaveTrend)}
                    </span>
                    <span>OT: {dept.overtimeHours}h</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {dept.contractExpiries > 0 && (
                  <span className="flex items-center gap-1 text-xs text-amber-600">
                    <Clock className="h-3 w-3" />
                    {dept.contractExpiries} expiring
                  </span>
                )}
                <Badge variant={getRiskBadgeVariant(dept.riskLevel)}>
                  {dept.riskLevel === 'high' ? 'High Risk' : 
                   dept.riskLevel === 'medium' ? 'Medium' : 'Stable'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4 p-2 bg-muted/50 rounded">
          Risk based on: vacancy rate, sick leave trend, overtime hours, contract expiries (&lt;6 months)
        </p>
      </CardContent>
    </Card>
  );
};

export default RiskRadar;
