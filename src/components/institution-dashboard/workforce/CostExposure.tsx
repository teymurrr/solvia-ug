import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Euro, TrendingUp, TrendingDown, Minus, Lightbulb } from 'lucide-react';
import { CostData } from './types';

interface CostExposureProps {
  data: CostData;
}

const CostExposure: React.FC<CostExposureProps> = ({ data }) => {
  const budgetUtilization = (data.monthlyPersonnelCost / data.monthlyBudget) * 100;
  const budgetRemaining = data.monthlyBudget - data.monthlyPersonnelCost;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Euro className="h-5 w-5" />
          Cost Exposure
        </CardTitle>
        <CardDescription>Personnel costs vs budget</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Budget vs Actual */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Monthly Personnel Cost</span>
            <span className="font-semibold">{formatCurrency(data.monthlyPersonnelCost)}</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                budgetUtilization <= 90 ? 'bg-green-500' :
                budgetUtilization <= 100 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{budgetUtilization.toFixed(1)}% of budget</span>
            <span>Budget: {formatCurrency(data.monthlyBudget)}</span>
          </div>
          <p className={`text-sm ${budgetRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {budgetRemaining >= 0 ? 
              `${formatCurrency(budgetRemaining)} under budget` : 
              `${formatCurrency(Math.abs(budgetRemaining))} over budget`}
          </p>
        </div>

        {/* Overtime Cost */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overtime Cost</p>
              <p className="text-xl font-semibold">{formatCurrency(data.overtimeCost)}</p>
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(data.overtimeTrend)}
              <span className={`text-sm ${
                data.overtimeTrend === 'up' ? 'text-red-500' :
                data.overtimeTrend === 'down' ? 'text-green-500' : 'text-muted-foreground'
              }`}>
                {data.overtimeTrend === 'up' ? 'Increasing' :
                 data.overtimeTrend === 'down' ? 'Decreasing' : 'Stable'}
              </span>
            </div>
          </div>
        </div>

        {/* Insight */}
        {data.insight && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900">
            <Lightbulb className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-200">{data.insight}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CostExposure;
